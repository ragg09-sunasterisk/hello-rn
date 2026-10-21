import { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

// The Android flag. Old Architecture needed it; RN 0.86 is New-Architecture-only,
// where it is a no-op that only prints a warning — so call it only on the old one.
const isNewArchitecture = "nativeFabricUIManager" in globalThis;
if (Platform.OS === "android" && !isNewArchitecture) {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Props = { question: string; answer: string };

export function FaqItemLayoutAnimation({ question, answer }: Props) {
  const [open, setOpen] = useState(false);

  function toggle() {
    // Call immediately BEFORE the state change that alters layout.
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  }

  return (
    <View style={styles.item}>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <Text style={styles.question}>
          {open ? "▾" : "▸"} {question}
        </Text>
      </Pressable>
      {open && <Text style={styles.answer}>{answer}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#c4c4c8",
    paddingVertical: 12,
  },
  question: { fontSize: 16, fontWeight: 600, color: "#11181c" },
  answer: { fontSize: 15, lineHeight: 22, color: "#60646c", paddingTop: 8 },
});
