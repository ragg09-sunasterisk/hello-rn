import { ScrollView, StyleSheet, Text } from "react-native";

import { type Row } from "@/utils/make-rows";

type Props = {
  rows: Row[];
  onMounted: () => void;
};

export function ScrollViewRows({ rows, onMounted }: Props) {
  return (
    <ScrollView onLayout={onMounted}>
      {rows.map((row) => (
        <Text key={row.id} style={styles.row}>
          {row.name}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
});
