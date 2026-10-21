import { Link } from "expo-router";
import { ScrollView, Text } from "react-native";

export default function DrillsIndex() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Link href="/drills/day-2">
        <Text>Day 2 · Layout and flexbox</Text>
      </Link>

      <Link href="/drills/day-3">
        <Text>Day 3 · Note composer</Text>
      </Link>

      <Link href="/drills/day-4">
        <Text>Day 4 · Touch and press</Text>
      </Link>

      <Link href="/drills/day-5">
        <Text>Day 5 · Five thousand rows</Text>
      </Link>

      <Link href="/drills/day-7">
        <Text>Day 7 · API client</Text>
      </Link>

      <Link href="/drills/day-9">
        <Text>Day 9 · Gallery</Text>
      </Link>

      <Link href="/drills/day-10">
        <Text>Day 10 · Platform-specific</Text>
      </Link>

      <Link href="/drills/day-11">
        <Text>Day 11 · Collapsing header</Text>
      </Link>

      <Link href="/drills/day-11-faq">
        <Text>Day 11 · FAQ (LayoutAnimation vs Animated)</Text>
      </Link>
    </ScrollView>
  );
}
