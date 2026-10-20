import { request } from "@/lib/api";
import { getToken } from "@/lib/auth-token";
import { type Note } from "@/utils/fake-notes";

// Flip to true to see the error state in the Notes tab.
const SIMULATE_SERVER_ERROR = false;
// Flip to true to see queued notes retry and then fail.
const SIMULATE_SYNC_FAILURE = false;

const NOTES_URL = SIMULATE_SERVER_ERROR
  ? "https://httpbin.org/status/500"
  : "https://jsonplaceholder.typicode.com/posts?_limit=10";

const CREATE_URL = SIMULATE_SYNC_FAILURE
  ? "https://httpbin.org/status/500"
  : "https://jsonplaceholder.typicode.com/posts";

type RemotePost = { id: number; title: string };

export async function fetchNotes(): Promise<Note[]> {
  const posts = await request<RemotePost[]>(NOTES_URL, { timeoutMs: 8000 });
  return posts.map((post) => ({ id: String(post.id), title: post.title }));
}

export async function createRemoteNote(title: string): Promise<void> {
  const token = await getToken();
  await request<RemotePost>(CREATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ title }),
    timeoutMs: 8000,
    retries: 1,
  });
}
