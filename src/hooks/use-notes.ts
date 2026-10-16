import { useCallback, useEffect, useState } from "react";

import { fetchNotes } from "@/lib/notes-api";
import { type Note } from "@/utils/fake-notes";

export type NotesState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; notes: Note[] };

export function useNotes() {
  const [state, setState] = useState<NotesState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    fetchNotes()
      .then((notes) => {
        if (!cancelled) setState({ status: "success", notes });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          setState({ status: "error", message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { state, retry };
}
