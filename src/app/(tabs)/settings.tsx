import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/components/app-button";
import {
  deleteInsecureDemoToken,
  deleteToken,
  getToken,
  readInsecureDemoToken,
  saveToken,
  saveTokenInsecurelyForDemo,
} from "@/lib/auth-token";

const DEMO_TOKEN = "demo-token-abc123";

export default function SettingScreen() {
  const [output, setOutput] = useState("");

  async function show() {
    const secure = await getToken();
    const insecure = await readInsecureDemoToken();
    setOutput(
      `SecureStore: ${secure ?? "(empty)"}\nAsyncStorage: ${insecure ?? "(empty)"}`,
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <AppButton title="New note" onPress={() => router.push("/compose")} />

        <Text style={styles.heading}>Auth token demo</Text>
        <AppButton
          title="Save token to SecureStore"
          onPress={async () => {
            await saveToken(DEMO_TOKEN);
            await show();
          }}
        />
        <AppButton
          title="Save SAME token to AsyncStorage (insecure demo)"
          variant="danger"
          onPress={async () => {
            await saveTokenInsecurelyForDemo(DEMO_TOKEN);
            await show();
          }}
        />
        <AppButton
          title="Clear both"
          variant="secondary"
          onPress={async () => {
            await deleteToken();
            await deleteInsecureDemoToken();
            await show();
          }}
        />
        <Text style={styles.output}>{output}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 28, fontWeight: 600 },
  heading: { fontSize: 16, fontWeight: 600, marginTop: 8 },
  output: { fontFamily: "monospace", color: "#60646c" },
});
