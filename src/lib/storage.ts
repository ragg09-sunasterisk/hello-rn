import AsyncStorage from "@react-native-async-storage/async-storage";

// Versioned keys: if the shape changes later, bump v1 → v2 instead of crashing on old data.
export const KEYS = {
  serverNotes: "fieldkit:server-notes:v1",
  localNotes: "fieldkit:local-notes:v1",
} as const;

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback; // corrupt or unreadable: start fresh instead of crashing
  }
}

export async function writeJson(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
