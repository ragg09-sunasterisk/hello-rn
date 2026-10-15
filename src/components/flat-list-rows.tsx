import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { type Row } from "@/utils/make-rows";

type Props = {
  rows: Row[];
  onMounted: () => void;
};

function Divider() {
  return <View style={styles.divider} />;
}

export function FlatListRows({ rows, onMounted }: Props) {
  const [data, setData] = useState<Row[]>(rows);
  const [refreshing, setRefreshing] = useState(false);

  function refresh() {
    setRefreshing(true);
    setTimeout(() => {
      setData((prev) => [...prev].reverse());
      setRefreshing(false);
    }, 1000);
  }

  return (
    <FlatList
      data={data}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
      keyExtractor={(row) => row.id}
      renderItem={({ item }) => <Text style={styles.row}>{item.name}</Text>}
      onLayout={onMounted}
      ItemSeparatorComponent={Divider}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#c4c4c8",
    marginLeft: 16,
  },
});
