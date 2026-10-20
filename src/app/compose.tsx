import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { useNotesStore } from "@/providers/notes-provider";

export default function ComposeModal() {
  const { createNote } = useNotesStore();
  const [title, setTitle] = useState("");
  const canSave = title.trim().length > 0;

  function save() {
    if (!canSave) return;
    createNote(title.trim());
    router.back();
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="What did you see?"
        returnKeyType="done"
        onSubmitEditing={save}
        style={styles.input}
      />
      <AppButton title="Save" disabled={!canSave} onPress={save} />
      <AppButton
        title="Cancel"
        variant="secondary"
        onPress={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 12 },
  label: { fontWeight: 600 },
  input: {
    borderWidth: 1,
    borderColor: "#c4c4c8",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
