import { useCallback, useEffect, useRef, useState } from "react";

type SocketStatus = "connecting" | "open" | "closed";
type SocketLine = { id: number; text: string };

const MAX_DELAY_MS = 30_000;

export function useEchoSocket(url: string) {
  const [status, setStatus] = useState<SocketStatus>("connecting");
  const [messages, setMessages] = useState<SocketLine[]>([]);
  const nextIdRef = useRef(0);
  const socketRef = useRef<WebSocket | null>(null);
  const attemptRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stoppedRef = useRef(false);

  const add = useCallback((line: string) => {
    const entry = {
      id: nextIdRef.current++,
      text: `${new Date().toLocaleTimeString()} ${line}`,
    };
    setMessages((prev) => [entry, ...prev].slice(0, 12));
  }, []);

  const connect = useCallback(() => {
    setStatus("connecting");
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      attemptRef.current = 0; // reset backoff after a good connection
      setStatus("open");
      add("open");
    };
    ws.onmessage = (event) => add(`← ${String(event.data)}`);
    ws.onerror = () => add("error");
    ws.onclose = () => {
      setStatus("closed");
      if (stoppedRef.current) return; // we closed it on purpose (unmount)
      const delay = Math.min(1000 * 2 ** attemptRef.current, MAX_DELAY_MS);
      attemptRef.current += 1;
      add(`closed — reconnecting in ${delay} ms`);
      timerRef.current = setTimeout(connect, delay);
    };
  }, [url, add]);

  useEffect(() => {
    stoppedRef.current = false;
    connect();
    return () => {
      stoppedRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      socketRef.current?.close();
    };
  }, [connect]);

  const send = useCallback(
    (text: string) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(text);
        add(`→ ${text}`);
      }
    },
    [add],
  );

  // Simulates the server dropping us: onclose fires and the backoff kicks in.
  const drop = useCallback(() => socketRef.current?.close(), []);

  return { status, messages, send, drop };
}
