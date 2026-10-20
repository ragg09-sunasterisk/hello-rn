import { Link } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppButton } from "@/components/app-button";
import { SyncBanner } from "@/components/sync-banner";
import { useNotesStore } from "@/providers/notes-provider";

function Divider() {
  return <View style={styles.divider} />;
}

export default function NotesListScreen() {
  const {
    notes,
    hasLoaded,
    isOnline,
    isRefreshing,
    refreshError,
    refresh,
    retryFailed,
  } = useNotesStore();

  if (!hasLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Only an error screen when there is truly nothing to show.
  if (notes.length === 0 && refreshError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Couldn't load notes</Text>
        <Text style={styles.muted}>{refreshError}</Text>
        <AppButton title="Try again" onPress={refresh} />
      </View>
    );
  }

  return (
    <FlatList
      data={notes}
      keyExtractor={(note) => note.id}
      ItemSeparatorComponent={Divider}
      ListHeaderComponent={
        <SyncBanner
          notes={notes}
          isOnline={isOnline}
          onRetryFailed={retryFailed}
        />
      }
      refreshing={isRefreshing}
      onRefresh={refresh}
      renderItem={({ item }) => (
        <Link
          href={{ pathname: "/notes/[id]", params: { id: item.id } }}
          asChild
        >
          <Pressable style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            {item.status === "pending" && (
              <Text style={styles.pending}>Pending</Text>
            )}
            {item.status === "failed" && (
              <Text style={styles.failed}>Failed: {item.error}</Text>
            )}
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  muted: { color: "#60646c", textAlign: "center" },
  errorTitle: { fontSize: 18, fontWeight: 600 },
  row: { padding: 16, gap: 4 },
  title: { fontSize: 16 },
  pending: { fontSize: 12, fontWeight: 600, color: "#b07d00" },
  failed: { fontSize: 12, fontWeight: 600, color: "#e5484d" },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#c4c4c8",
    marginLeft: 16,
  },
});
