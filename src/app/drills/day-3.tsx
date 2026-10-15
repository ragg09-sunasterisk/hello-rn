import { useHeaderHeight } from "expo-router/react-navigation";
import { useRef, useState } from "react";
import {
  DynamicColorIOS,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  PlatformColor,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ColorValue,
} from "react-native";

import { BottomTabInset } from "@/constants/theme";

// Day 3 practice: FieldKit note composer.

type Note = { title: string; body: string; tags: string };

const MAX_TITLE = 60;

// Same trick as Day 2: only the current platform's color API runs.
const textColor = Platform.select<() => ColorValue>({
  ios: () => DynamicColorIOS({ light: "#11181c", dark: "#ecedee" }),
  android: () => PlatformColor("?android:attr/colorForeground"),
  default: () => "#11181c",
})();

const bgColor = Platform.select<() => ColorValue>({
  ios: () => DynamicColorIOS({ light: "#ffffff", dark: "#000000" }),
  android: () => PlatformColor("?android:attr/colorBackground"),
  default: () => "#ffffff",
})();

export default function DayThreeScreen() {
  const [note, setNote] = useState<Note>({ title: "", body: "", tags: "" });
  const bodyRef = useRef<TextInput>(null);
  const headerHeight = useHeaderHeight();

  const titleInvalid =
    note.title.trim() === "" || note.title.length > MAX_TITLE;

  function save() {
    if (titleInvalid) return;
    console.log("[drill-3] saved", note);
    setNote({ title: "", body: "", tags: "" });
    Keyboard.dismiss();
  }

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, gap: 12 }}
        >
          <Text style={[styles.label, { color: textColor }]}>Title</Text>
          <TextInput
            value={note.title}
            onChangeText={(title) => setNote({ ...note, title })}
            placeholder="What is this note about?"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => bodyRef.current?.focus()}
            style={[
              styles.input,
              { color: textColor },
              titleInvalid && styles.inputError,
            ]}
          />
          <Text
            accessibilityLiveRegion="polite"
            style={{ color: titleInvalid ? "#e5484d" : "#60646c" }}
          >
            {MAX_TITLE - note.title.length} characters left
          </Text>

          <Text style={[styles.label, { color: textColor }]}>Body</Text>
          <TextInput
            ref={bodyRef}
            value={note.body}
            onChangeText={(body) => setNote({ ...note, body })}
            placeholder="Write your note…"
            multiline
            textAlignVertical="top"
            style={[styles.input, styles.body, { color: textColor }]}
          />

          <Text style={[styles.label, { color: textColor }]}>Tags</Text>
          <TextInput
            value={note.tags}
            onChangeText={(tags) => setNote({ ...note, tags })}
            placeholder="site-a, soil"
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.input, { color: textColor }]}
          />
        </ScrollView>

        {/* Outside the ScrollView, so it stays above the keyboard */}
        <View style={styles.footer}>
          <Pressable
            onPress={save}
            disabled={titleInvalid}
            style={[styles.button, titleInvalid && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: 600,
  },
  input: {
    borderWidth: 1,
    borderColor: "#c4c4c8",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#e5484d",
  },
  body: {
    minHeight: 120,
  },
  footer: {
    padding: 16,
    paddingBottom: BottomTabInset,
  },
  button: {
    backgroundColor: "#3c87f7",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: 600,
  },
});
