import { router, Stack } from "expo-router";

import { IconButton } from "@/components/icon-button";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function NotesLayout() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <IconButton
            icon="＋"
            label="New note"
            onPress={() => router.push("/compose")}
          />
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Notes" }} />
      <Stack.Screen name="[id]/index" options={{ title: "Note" }} />
      <Stack.Screen name="[id]/edit" options={{ title: "Edit note" }} />
    </Stack>
  );
}
