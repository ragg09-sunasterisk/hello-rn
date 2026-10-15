import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CASE_THREE_THEME as THEME } from "@/constants/drill-theme";
import { formatCountLabel } from "@/utils/format-count-label";

// Case 3 (refactored): THEME moved to @/constants/drill-theme, so this file exports only a component again.
console.log("[case-3] module evaluated");

export function CaseThreeScreen() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("[case-3] mounted");
    return () => console.log("[case-3] cleanup");
  }, []);

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold">
        Case 3 · THEME in its own module (refactored)
      </ThemedText>
      <Pressable testID="case-3-button" onPress={() => setCount((c) => c + 1)}>
        <ThemedText
          type="subtitle"
          testID="case-3-count"
          style={{ color: THEME.accent }}
        >
          {formatCountLabel(count)}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 16, gap: 8, alignSelf: "stretch" },
});
