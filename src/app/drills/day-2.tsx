import {
  DynamicColorIOS,
  Platform,
  PlatformColor,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ColorValue,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Day 2 practice. The web CSS being ported:
//   .row  { display: flex; flex-wrap: wrap; height: 300px; gap: 12px; padding: 16px; }
//   .card { flex: 1 1 140px; padding: 12px; }
//   .head { display: flex; gap: 8px; }

const CARDS = [
  { title: "Wireless mechanical keyboard, 75% hot-swap ", price: "$129" },
  { title: "Mouse", price: "$49" },
  { title: "USB-C hub", price: "$35" },
  { title: "27-inch 4K monitor", price: "$399" },
];

const LONG_MESSAGE = "This message is long on purpose so it has to wrap. "
  .repeat(8)
  .slice(0, 400);

// Functions, so only the current platform's API runs (DynamicColorIOS throws on Android).
const textColor = Platform.select<() => ColorValue>({
  ios: () => DynamicColorIOS({ light: "#11181c", dark: "#ecedee" }),
  android: () => PlatformColor("?android:attr/colorForeground"),
  default: () => "#11181c",
})();

const bgColor = Platform.select<() => ColorValue>({
  ios: () => DynamicColorIOS({ light: "#ffffff", dark: "#000000" }),
  android: () => PlatformColor("?android:attr/colorBackground"),
  default: () => "#ffffff",
})();

export default function Drill2Screen() {
  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
          {/* Part 1: card row */}
          <View style={styles.row}>
            {CARDS.map((card) => (
              <View key={card.title} style={styles.card}>
                <View style={styles.head}>
                  <Text style={styles.title}>{card.title}</Text>
                  <Text>{card.price}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Part 2: chat row */}
          <View style={styles.chatRow}>
            <View style={styles.avatar}>
              <View style={styles.dot} />
            </View>
            <View style={styles.body}>
              <Text style={{ color: textColor }}>{LONG_MESSAGE}</Text>
            </View>
            <Text style={[styles.time, { color: textColor }]}>09:41</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    height: 300,
    gap: 12,
    padding: 16,
    backgroundColor: "#f0f0f3",
    alignContent: "stretch",
  },
  card: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 140,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  head: {
    flexDirection: "row",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    flexShrink: 1,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatar: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3c87f7",
  },
  dot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e5484d",
  },
  body: {
    flexGrow: 1,
    flexShrink: 1,
  },
  time: {
    flexShrink: 0,
  },
});
