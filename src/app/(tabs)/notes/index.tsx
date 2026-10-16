import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { NOTES } from "@/utils/fake-notes";

function Divider() {
  return <View style={styles.divider} />;
}

export default function NotesListScreen() {
  return (
    <FlatList
      data={NOTES}
      keyExtractor={(note) => note.id}
      ItemSeparatorComponent={Divider}
      renderItem={({ item }) => (
        <Link
          href={{ pathname: "/notes/[id]", params: { id: item.id } }}
          asChild
        >
          <Pressable style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: { padding: 16 },
  title: { fontSize: 16 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#c4c4c8",
    marginLeft: 16,
  },
});
