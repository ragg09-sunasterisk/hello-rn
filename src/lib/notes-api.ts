import { request } from "@/lib/api";
import { type Note } from "@/utils/fake-notes";

// Flip to true to see the error state in the Notes tab.
const SIMULATE_SERVER_ERROR = false;

const NOTES_URL = SIMULATE_SERVER_ERROR
  ? "https://httpbin.org/status/500"
  : "https://jsonplaceholder.typicode.com/posts?_limit=10";

type RemotePost = { id: number; title: string };

export async function fetchNotes(): Promise<Note[]> {
  const posts = await request<RemotePost[]>(NOTES_URL, { timeoutMs: 8000 });
  return posts.map((post) => ({ id: String(post.id), title: post.title }));
}
