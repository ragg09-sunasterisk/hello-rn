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
import { useNotes } from "@/hooks/use-notes";

function Divider() {
  return <View style={styles.divider} />;
}

export default function NotesListScreen() {
  const { state, retry } = useNotes();

  if (state.status === "loading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading notes…</Text>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Couldn't load notes</Text>
        <Text style={styles.muted}>{state.message}</Text>
        <AppButton title="Try again" onPress={retry} />
      </View>
    );
  }

  return (
    <FlatList
      data={state.notes}
      keyExtractor={(note) => note.id}
      ItemSeparatorComponent={Divider}
      renderItem={({ item }) => (
        <Link
          href={{ pathname: "/notes/[id]", params: { id: item.id } }}
          asChild
        >
          <Pressable style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
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
  row: { padding: 16 },
  title: { fontSize: 16 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#c4c4c8",
    marginLeft: 16,
  },
});
