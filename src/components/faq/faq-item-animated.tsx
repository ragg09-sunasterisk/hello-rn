import { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

type Props = { question: string; answer: string };

export function FaqItemAnimated({ question, answer }: Props) {
  const [open, setOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  // Two values, two drivers — a value can only ever use ONE driver.
  const progress = useRef(new Animated.Value(0)).current; // height → JS driver
  const chevron = useRef(new Animated.Value(0)).current; // rotation → native driver

  function toggle() {
    const toValue = open ? 0 : 1;
    // height is a LAYOUT property: the native driver cannot animate it.
    Animated.timing(progress, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(chevron, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  }

  const height = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });
  const rotate = chevron.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={styles.item}>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <View style={styles.row}>
          <Animated.Text style={[styles.chevron, { transform: [{ rotate }] }]}>
            ▸
          </Animated.Text>
          <Text style={styles.question}>{question}</Text>
        </View>
      </Pressable>
      <Animated.View style={[styles.clip, { height }]}>
        {/* Absolutely positioned so it measures its natural height even while the clip is 0. */}
        <View
          style={styles.measure}
          onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
        >
          <Text style={styles.answer}>{answer}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#c4c4c8",
    paddingVertical: 12,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  chevron: { fontSize: 16, color: "#11181c" },
  question: { flex: 1, fontSize: 16, fontWeight: 600, color: "#11181c" },
  clip: { overflow: "hidden" },
  measure: { position: "absolute", top: 0, left: 0, right: 0 },
  answer: { fontSize: 15, lineHeight: 22, color: "#60646c", paddingTop: 8 },
});
