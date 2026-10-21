import { ScrollView, StyleSheet, Text } from "react-native";

import { AppButton } from "@/components/app-button";
import { FaqItemAnimated } from "@/components/faq/faq-item-animated";
import { FaqItemLayoutAnimation } from "@/components/faq/faq-item-layout-animation";
import { blockJsThread } from "@/utils/block-js";

const FAQ = [
  {
    question: "Does FieldKit work offline?",
    answer:
      "Yes. Notes are cached on the device, new notes are queued, and everything syncs when you reconnect.",
  },
  {
    question: "Where is my login token stored?",
    answer:
      "In SecureStore — the iOS Keychain or Android Keystore — never in AsyncStorage.",
  },
  {
    question: "Why do photos never jump while loading?",
    answer:
      "Each photo's box is sized from its known aspect ratio before any bytes arrive, so nothing shifts when the image appears.",
  },
];

export default function DayElevenFaqScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppButton
        title="Block JS thread for 2 s"
        variant="danger"
        onPress={() => blockJsThread(2000)}
      />
      <Text style={styles.hint}>
        Tap a question, then immediately tap Block, to compare.
      </Text>

      <Text style={styles.heading}>A. LayoutAnimation</Text>
      {FAQ.map((item) => (
        <FaqItemLayoutAnimation key={item.question} {...item} />
      ))}

      <Text style={styles.heading}>B. Animated (height, JS driver)</Text>
      {FAQ.map((item) => (
        <FaqItemAnimated key={item.question} {...item} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 8 },
  heading: { fontSize: 18, fontWeight: 700, marginTop: 16, color: "#11181c" },
  hint: { color: "#60646c", fontSize: 13 },
});
