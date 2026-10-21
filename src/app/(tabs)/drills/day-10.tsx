import { useRef, useState } from "react";
import {
  PixelRatio,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";

import { AppButton } from "@/components/app-button";
import { ConfirmSheet } from "@/components/confirm-sheet/confirm-sheet";
import { ConfirmSheetSelect } from "@/components/confirm-sheet/confirm-sheet-select";
import { supportsFeatureX } from "@/utils/platform-features";

type Impl = "file-extensions" | "platform-select";
type LogEntry = { id: number; text: string };

export default function DayTenScreen() {
  const [impl, setImpl] = useState<Impl>("file-extensions");
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const nextId = useRef(0);
  const { width, height, fontScale } = useWindowDimensions();

  function add(text: string) {
    const entry = { id: nextId.current++, text };
    setLog((prev) => [entry, ...prev].slice(0, 8));
  }

  // Same props, either component: that is "drop-in interchangeable".
  const Sheet = impl === "file-extensions" ? ConfirmSheet : ConfirmSheetSelect;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Platform</Text>
      <Text style={styles.line}>
        OS: {Platform.OS} · Version: {String(Platform.Version)} (
        {typeof Platform.Version})
      </Text>
      <Text style={styles.line}>
        supportsFeatureX(): {String(supportsFeatureX())}
      </Text>
      <Text style={styles.line}>
        Window: {Math.round(width)}×{Math.round(height)} · fontScale:{" "}
        {fontScale} · PixelRatio fontScale: {PixelRatio.getFontScale()}
      </Text>

      <Text style={styles.heading}>ConfirmSheet</Text>
      <Text style={styles.line}>Using: {impl}</Text>
      <AppButton
        title="Switch implementation"
        variant="secondary"
        onPress={() =>
          setImpl((v) =>
            v === "file-extensions" ? "platform-select" : "file-extensions",
          )
        }
      />
      <AppButton
        title="Delete note…"
        variant="danger"
        onPress={() => setOpen(true)}
      />

      <Sheet
        visible={open}
        title="Delete this note?"
        message="This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          setOpen(false);
          add(`${impl}: confirmed`);
        }}
        onCancel={() => {
          setOpen(false);
          add(`${impl}: cancelled`);
        }}
      />

      <Text style={styles.heading}>Log</Text>
      {log.map((entry) => (
        <Text key={entry.id} style={styles.line}>
          {entry.text}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 10 },
  heading: { fontSize: 16, fontWeight: 600, marginTop: 8 },
  line: { color: "#60646c", fontSize: 13 },
});
