import { AppButton } from "@/components/app-button";
import { IconButton } from "@/components/icon-button";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function DayFourScreen() {
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function add(message: string) {
    setLog((prev) =>
      [`${new Date().toLocaleTimeString()} ${message}`, ...prev].slice(0, 6),
    );
  }

  function fakeSave() {
    add("save pressed");
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>1. AppButton</Text>
      <AppButton title="Primary" onPress={() => add("primary")} />
      <AppButton
        title="Secondary"
        variant="secondary"
        onPress={() => add("secondary")}
      />
      <AppButton
        title="Delete"
        variant="danger"
        onPress={() => add("danger")}
      />
      <AppButton
        title="Disabled"
        disabled
        onPress={() => add("disabled — should never log")}
      />
      <AppButton title="Save" loading={loading} onPress={fakeSave} />

      <View style={styles.row}>
        <View style={styles.slopOutline}>
          <IconButton
            icon="✕"
            label="Close"
            debug
            onPress={() => add("icon tapped")}
          />
        </View>
        <Text style={styles.note}>
          Red = 24×24 visual. Dashed = 48×48 tap area.
        </Text>
      </View>

      <Text style={styles.heading}>3. Bounds-clipping bug</Text>
      <View style={styles.clipParent}>
        <Text style={styles.note}>Parent</Text>
        <View style={styles.halfOutside}>
          <IconButton
            icon="✕"
            label="Close (half outside)"
            debug
            onPress={() => add("half-outside icon tapped")}
          />
        </View>
      </View>

      <Text style={[styles.heading, { marginTop: 20 }]}>Log</Text>
      {log.map((line) => (
        <Text key={line} style={styles.note}>
          {line}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  heading: { fontSize: 16, fontWeight: 600, marginTop: 8 },
  note: { color: "#60646c" },
  row: { flexDirection: "row", alignItems: "center", gap: 16 },
  slopOutline: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#3c87f7",
  },
  clipParent: {
    height: 60,
    padding: 8,
    backgroundColor: "#f0f0f3",
    borderRadius: 8,
  },
  halfOutside: {
    position: "absolute",
    top: 18,
    right: -12,
  },
});
