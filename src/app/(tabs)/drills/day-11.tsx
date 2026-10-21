import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { blockJsThread } from "@/utils/block-js";

const HEADER_HEIGHT = 220;
const COLLAPSED_HEIGHT = 72;
const SCROLL_DISTANCE = HEADER_HEIGHT - COLLAPSED_HEIGHT; // 148

const PARAGRAPHS = Array.from(
  { length: 14 },
  (_, i) =>
    `Observation ${i + 1}. Soil was damp after last night's rain; samples bagged and labelled. ` +
    "Scroll to collapse the header, then block the JS thread and keep scrolling.",
);

export default function DayElevenScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const [ticks, setTicks] = useState(0);

  // --- Header: only transform + opacity, so the native driver can run it ---
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, -SCROLL_DISTANCE],
    extrapolate: "clamp",
  });
  const titleScale = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [1, 0.75],
    extrapolate: "clamp",
  });
  const detailsOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // --- Proof helpers ---
  // 1. A spinner on the native driver: keeps turning while JS is blocked.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false, // long-running: don't hold up FlatList rendering
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // 2. A JS-thread counter: freezes while JS is blocked.
  useEffect(() => {
    const id = setInterval(() => setTicks((t) => t + 1), 100);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.screen}>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
      >
        <View style={styles.proof}>
          <Animated.View
            style={[styles.spinner, { transform: [{ rotate }] }]}
          />
          <Text style={styles.proofText}>JS ticks: {ticks}</Text>
        </View>
        <AppButton
          title="Block JS thread for 2 s"
          variant="danger"
          onPress={() => blockJsThread(2000)}
        />
        {PARAGRAPHS.map((text) => (
          <Text key={text} style={styles.paragraph}>
            {text}
          </Text>
        ))}
      </Animated.ScrollView>

      {/* Absolutely positioned ABOVE the ScrollView; moved with translateY, never resized. */}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
        pointerEvents="none"
      >
        <Animated.View style={{ opacity: detailsOpacity }}>
          <Text style={styles.meta}>Site A · 21 Oct · 3 photos</Text>
        </Animated.View>
        <Animated.Text
          style={[styles.title, { transform: [{ scale: titleScale }] }]}
        >
          Soil sample notes
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingTop: HEADER_HEIGHT + 16,
    paddingHorizontal: 16,
    paddingBottom: 48,
    gap: 12,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: "#3c87f7",
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: "flex-end",
    gap: 8,
  },
  meta: { color: "#ffffffcc", fontSize: 14 },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: 700,
    transformOrigin: "left center",
  },
  proof: { flexDirection: "row", alignItems: "center", gap: 12 },
  spinner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 4,
    borderColor: "#3c87f7",
    borderTopColor: "transparent",
  },
  proofText: { fontSize: 16, fontVariant: ["tabular-nums"] },
  paragraph: { fontSize: 16, lineHeight: 24, color: "#11181c" },
});
