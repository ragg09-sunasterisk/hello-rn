// Typed fetch wrapper that fails loudly instead of silently.

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
  ) {
    super(`HTTP ${status}`);
    this.name = "HttpError";
  }
}

export class TimeoutError extends Error {
  constructor(readonly ms: number) {
    super(`Timed out after ${ms} ms`);
    this.name = "TimeoutError";
  }
}

export class NetworkError extends Error {
  constructor(readonly cause: unknown) {
    super("Network request failed");
    this.name = "NetworkError";
  }
}

export class ParseError extends Error {
  constructor(readonly body: string) {
    super("Response was not valid JSON");
    this.name = "ParseError";
  }
}

export type ApiError = HttpError | TimeoutError | NetworkError | ParseError;

// ---- Logging hook: no-op in production ----

export type ApiLogEvent =
  | { type: "request"; url: string; attempt: number }
  | { type: "response"; url: string; status: number; ms: number }
  | { type: "error"; url: string; error: ApiError; attempt: number }
  | { type: "retry"; url: string; attempt: number; delayMs: number };

type ApiLogger = (event: ApiLogEvent) => void;

const noop: ApiLogger = () => {};
const devLogger: ApiLogger = (event) => console.log("[api]", event);

let logger: ApiLogger = __DEV__ ? devLogger : noop;

export function setApiLogger(next: ApiLogger | null) {
  if (!__DEV__) return; // production: always a no-op
  logger = next ?? devLogger;
}

// ---- One attempt: timeout + ok check + guarded JSON ----

async function requestOnce<T>(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  attempt: number,
): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const started = Date.now();

  logger({ type: "request", url, attempt });

  try {
    let response: Response;
    try {
      response = await fetch(url, { ...init, signal: controller.signal });
    } catch (cause) {
      throw timedOut ? new TimeoutError(timeoutMs) : new NetworkError(cause);
    }

    logger({
      type: "response",
      url,
      status: response.status,
      ms: Date.now() - started,
    });

    const text = await response.text();
    if (!response.ok) throw new HttpError(response.status, text);

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ParseError(text);
    }
  } finally {
    clearTimeout(timer);
  }
}

// ---- Retry policy: 5xx and network errors only ----

function isRetryable(error: unknown): boolean {
  if (error instanceof HttpError) return error.status >= 500;
  return error instanceof NetworkError;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type RequestOptions = RequestInit & {
  timeoutMs?: number;
  retries?: number;
  baseDelayMs?: number;
};

export async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    timeoutMs = 10_000,
    retries = 3,
    baseDelayMs = 500,
    ...init
  } = options;

  for (let attempt = 0; ; attempt++) {
    try {
      return await requestOnce<T>(url, init, timeoutMs, attempt);
    } catch (error) {
      logger({ type: "error", url, error: error as ApiError, attempt });
      if (attempt >= retries || !isRetryable(error)) throw error;
      const delayMs = baseDelayMs * 2 ** attempt; // 500, 1000, 2000…
      logger({ type: "retry", url, attempt: attempt + 1, delayMs });
      await sleep(delayMs);
    }
  }
}
