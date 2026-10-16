import { router, Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { getNote } from "@/utils/fake-notes";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const note = getNote(id);

  if (!note) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ title: "Not found" }} />
        <Text>No note with id {id}.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: note.title }} />
      <Text>Detail for note id: {note.id}</Text>
      <AppButton
        title="Edit"
        onPress={() =>
          router.push({ pathname: "/notes/[id]/edit", params: { id: note.id } })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 16 },
});
