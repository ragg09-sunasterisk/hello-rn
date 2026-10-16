import { AppButton } from "@/components/app-button";
import { useEchoSocket } from "@/hooks/use-echo-socket";
import { request, setApiLogger } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

type LogEntry = { id: number; text: string };

const SERVER_ERROR_URL = "https://httpbin.org/status/500";
const NOT_FOUND_URL = "https://httpbin.org/status/404";
const SLOW_URL = "https://httpbin.org/delay/5";
const OK_URL = "https://jsonplaceholder.typicode.com/posts/1";
const ECHO_URL = "wss://echo.websocket.org";

export default function DaySevenScreen() {
  const [log, setLog] = useState<LogEntry[]>([]);
  const nextId = useRef(0);
  const socket = useEchoSocket(ECHO_URL);

  function add(text: string) {
    const entry = { id: nextId.current++, text };
    setLog((prev) => [entry, ...prev].slice(0, 30));
  }

  function naive500() {
    add("NAIVE → 500");
    fetch(SERVER_ERROR_URL)
      .then((r) => r.json())
      .then((data) => add(`NAIVE success?! ${JSON.stringify(data)}`));
    // no .catch: the failure is dropped silently
  }

  async function run(
    label: string,
    url: string,
    options?: Parameters<typeof request>[1],
  ) {
    add(`${label} →`);
    try {
      const data = await request<unknown>(url, options);
      add(`${label} OK ${JSON.stringify(data).slice(0, 60)}`);
    } catch (error) {
      const e = error as Error;
      add(`${label} FAILED: ${e.name} — ${e.message}`);
    }
  }

  useEffect(() => {
    setApiLogger((event) => {
      if (event.type === "response")
        add(`  response ${event.status} (${event.ms} ms)`);
      if (event.type === "retry")
        add(`  retry #${event.attempt} in ${event.delayMs} ms`);
    });
    return () => setApiLogger(null);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>HTTP</Text>
      <AppButton
        title="Naive fetch → 500"
        variant="secondary"
        onPress={naive500}
      />

      <AppButton
        title="api.ts → 500 (retries)"
        onPress={() => run("500", SERVER_ERROR_URL)}
      />

      <AppButton
        title="api.ts → 404 (no retry)"
        onPress={() => run("404", NOT_FOUND_URL)}
      />

      <AppButton
        title="api.ts → timeout (2 s vs 5 s server)"
        onPress={() => run("timeout", SLOW_URL, { timeoutMs: 2000 })}
      />

      <AppButton title="api.ts → success" onPress={() => run("ok", OK_URL)} />

      <Text style={styles.heading}>WebSocket ({socket.status})</Text>
      <AppButton title="Send 'hello'" onPress={() => socket.send("hello")} />
      <AppButton
        title="Drop connection"
        variant="danger"
        onPress={socket.drop}
      />
      {socket.messages.map((line) => (
        <Text key={line.id} style={styles.line}>
          {line.text}
        </Text>
      ))}

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
