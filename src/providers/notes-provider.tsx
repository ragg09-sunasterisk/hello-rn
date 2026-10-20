// ===== Chunk 1: imports, types, constants, context, helpers =====
import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AppState } from "react-native";

import { createRemoteNote, fetchNotes } from "@/lib/notes-api";
import { KEYS, readJson, writeJson } from "@/lib/storage";
import { type Note } from "@/utils/fake-notes";

export type SyncStatus = "synced" | "pending" | "failed";
export type LocalNote = Note & {
  status: SyncStatus;
  attempts: number;
  error?: string;
};

const MAX_SYNC_ATTEMPTS = 3;
const RETRY_DELAY_MS = 5000;

type NotesContextValue = {
  notes: LocalNote[];
  hasLoaded: boolean;
  isOnline: boolean;
  isRefreshing: boolean;
  refreshError: string | null;
  createNote: (title: string) => void;
  retryFailed: () => void;
  refresh: () => Promise<void>;
};

const NotesContext = createContext<NotesContextValue | null>(null);

function isOnlineState(state: NetInfoState) {
  return state.isConnected === true && state.isInternetReachable !== false;
}

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export function NotesProvider({ children }: { children: ReactNode }) {
  // ===== Chunk 2: state, refs, save helpers =====
  const [serverNotes, setServerNotes] = useState<Note[]>([]);
  const [localNotes, setLocalNotes] = useState<LocalNote[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  // The queue's source of truth, so async code never reads a stale copy.
  const localRef = useRef<LocalNote[]>([]);
  const flushingRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveLocal = useCallback((next: LocalNote[]) => {
    localRef.current = next;
    setLocalNotes(next);
    void writeJson(KEYS.localNotes, next);
  }, []);

  const updateLocal = useCallback(
    (id: string, patch: Partial<LocalNote>) => {
      saveLocal(
        localRef.current.map((n) => (n.id === id ? { ...n, ...patch } : n)),
      );
    },
    [saveLocal],
  );

  // ===== Chunk 3: refresh() — READ path =====
  // server → memory → disk. On failure keep showing the cache.
  const refresh = useCallback(async () => {
    if (!isOnlineState(await NetInfo.fetch())) {
      setRefreshError("Offline");
      return;
    }
    setIsRefreshing(true);
    try {
      const notes = await fetchNotes();
      setServerNotes(notes);
      setRefreshError(null);
      await writeJson(KEYS.serverNotes, notes);
    } catch (error) {
      setRefreshError(messageOf(error));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // ===== Chunk 4: flush() — WRITE path =====
  // Send every pending note; count failures; give up after N.
  const flush = useCallback(
    async function flushQueue(): Promise<void> {
      if (flushingRef.current) return;
      if (!isOnlineState(await NetInfo.fetch())) return; // offline is not a failure
      flushingRef.current = true;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);

      try {
        const pending = localRef.current.filter((n) => n.status === "pending");
        for (const note of pending) {
          try {
            await createRemoteNote(note.title);
            updateLocal(note.id, { status: "synced", error: undefined });
          } catch (error) {
            const attempts = note.attempts + 1;
            updateLocal(note.id, {
              attempts,
              status: attempts >= MAX_SYNC_ATTEMPTS ? "failed" : "pending",
              error: messageOf(error),
            });
          }
        }
      } finally {
        flushingRef.current = false;
      }

      // Anything still pending gets another go later.
      if (localRef.current.some((n) => n.status === "pending")) {
        retryTimerRef.current = setTimeout(
          () => void flushQueue(),
          RETRY_DELAY_MS,
        );
      }
    },
    [updateLocal],
  );

  // ===== Chunk 5: the three triggers =====

  // 1. Cold start: show the disk cache first, then try the network.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [cachedServer, cachedLocal] = await Promise.all([
        readJson<Note[]>(KEYS.serverNotes, []),
        readJson<LocalNote[]>(KEYS.localNotes, []),
      ]);
      if (cancelled) return;
      setServerNotes(cachedServer);
      localRef.current = cachedLocal;
      setLocalNotes(cachedLocal);
      setHasLoaded(true);
      void refresh();
      void flush();
    })();
    return () => {
      cancelled = true;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [refresh, flush]);

  // 2. Reconnect: flush the queue and refresh.
  useEffect(() => {
    let wasOnline: boolean | null = null;
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = isOnlineState(state);
      setIsOnline(online);
      if (online && wasOnline === false) {
        void flush();
        void refresh();
      }
      wasOnline = online;
    });
    return unsubscribe;
  }, [flush, refresh]);

  // 3. AppState: refresh on foreground, last-chance flush on background.
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next === "active") {
        void refresh();
        void flush();
      }
      if (next === "background") void flush();
    });
    return () => sub.remove();
  }, [refresh, flush]);

  // ===== Chunk 6: actions, merged list, context value =====
  const createNote = useCallback(
    (title: string) => {
      const note: LocalNote = {
        id: `local-${Date.now()}`,
        title,
        status: "pending",
        attempts: 0,
      };
      saveLocal([note, ...localRef.current]); // optimistic: visible right away
      void flush();
    },
    [saveLocal, flush],
  );

  const retryFailed = useCallback(() => {
    saveLocal(
      localRef.current.map((n) =>
        n.status === "failed" ? { ...n, status: "pending", attempts: 0 } : n,
      ),
    );
    void flush();
  }, [saveLocal, flush]);

  const notes = useMemo<LocalNote[]>(
    () => [
      ...localNotes,
      ...serverNotes.map((n) => ({
        ...n,
        status: "synced" as const,
        attempts: 0,
      })),
    ],
    [localNotes, serverNotes],
  );

  const value: NotesContextValue = {
    notes,
    hasLoaded,
    isOnline,
    isRefreshing,
    refreshError,
    createNote,
    retryFailed,
    refresh,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

// ===== Chunk 7: the hook screens use =====
export function useNotesStore() {
  const value = useContext(NotesContext);
  if (!value)
    throw new Error("useNotesStore must be used inside <NotesProvider>");
  return value;
}
