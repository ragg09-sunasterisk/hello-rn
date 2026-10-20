import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { type LocalNote } from "@/providers/notes-provider";

type Props = {
  notes: LocalNote[];
  isOnline: boolean;
  onRetryFailed: () => void;
};

export function SyncBanner({ notes, isOnline, onRetryFailed }: Props) {
  const pending = notes.filter((n) => n.status === "pending").length;
  const failed = notes.filter((n) => n.status === "failed").length;

  if (failed > 0) {
    return (
      <View style={[styles.banner, styles.failed]}>
        <Text style={styles.text}>
          {failed} note{failed === 1 ? "" : "s"} failed to sync
        </Text>
        <AppButton title="Retry" variant="danger" onPress={onRetryFailed} />
      </View>
    );
  }

  const text = !isOnline
    ? `Offline — showing saved notes${pending ? ` · ${pending} waiting to sync` : ""}`
    : pending
      ? `Syncing ${pending} note${pending === 1 ? "" : "s"}…`
      : "All changes synced";

  return (
    <View
      style={[
        styles.banner,
        !isOnline ? styles.offline : pending ? styles.pending : styles.ok,
      ]}
    >
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 12, gap: 8 },
  text: { fontSize: 14, fontWeight: 600, color: "#11181c" },
  ok: { backgroundColor: "#e6f6ec" },
  pending: { backgroundColor: "#fff4d6" },
  offline: { backgroundColor: "#e0e1e6" },
  failed: { backgroundColor: "#fde2e2" },
});
