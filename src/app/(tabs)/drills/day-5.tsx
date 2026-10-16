import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { FlatListRows } from "@/components/flat-list-rows";
import { ScrollViewRows } from "@/components/scroll-view-rows";
import { makeRows } from "@/utils/make-rows";

type Mode = "none" | "scrollview" | "flatlist";
type Result = { id: number; mode: Mode; ms: number };

const ROWS = makeRows();

export default function DayFiveScreen() {
  const [mode, setMode] = useState<Mode>("none");
  const [results, setResults] = useState<Result[]>([]);
  const startedAt = useRef(0);
  const measured = useRef(false);
  const nextId = useRef(0);

  function show(next: Mode) {
    startedAt.current = performance.now();
    measured.current = false;
    setMode(next);
  }

  function handleMounted() {
    if (measured.current) return;
    measured.current = true;
    const ms = Math.round(performance.now() - startedAt.current);
    setResults((prev) => [{ id: nextId.current++, mode, ms }, ...prev]);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.controls}>
        <View style={styles.buttons}>
          <View style={styles.flex}>
            <AppButton title="ScrollView" onPress={() => show("scrollview")} />
          </View>
          <View style={styles.flex}>
            <AppButton title="FlatList" onPress={() => show("flatlist")} />
          </View>
          <View style={styles.flex}>
            <AppButton
              title="Clear"
              variant="secondary"
              onPress={() => setMode("none")}
            />
          </View>
        </View>
        {results.slice(0, 6).map((r) => (
          <Text key={r.id} style={styles.result}>
            {r.mode}: {r.ms} ms
          </Text>
        ))}
      </View>

      <View style={styles.flex}>
        {mode === "scrollview" && (
          <ScrollViewRows rows={ROWS} onMounted={handleMounted} />
        )}

        {mode === "flatlist" && (
          <FlatListRows rows={ROWS} onMounted={handleMounted} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  controls: { padding: 16, gap: 8 },
  buttons: { flexDirection: "row", gap: 8 },
  result: { color: "#60646c" },
});
