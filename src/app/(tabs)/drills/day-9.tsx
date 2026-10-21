import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Avatar } from "@/components/avatar";
import { PhotoTile } from "@/components/photo-tile";
import { PHOTOS } from "@/utils/photos";

const DENSITY_MARKER = require("@/assets/images/density-marker.png");
const AVATAR_URI = "https://picsum.photos/id/64/300/300";

type LogEntry = { id: number; text: string };

export default function DayNineScreen() {
  const [log, setLog] = useState<LogEntry[]>([]);
  const nextId = useRef(0);

  function add(text: string) {
    const entry = { id: nextId.current++, text };
    setLog((prev) => [...prev, entry]);
  }

  // Cache report: query → prefetch the uncached → query again.
  useEffect(() => {
    const urls = PHOTOS.map((p) => p.uri);
    (async () => {
      const before = (await Image.queryCache?.(urls)) ?? {};
      console.log("[cache] before", before);
      add(`before: ${Object.keys(before).length}/${urls.length} cached`);

      const uncached = urls.filter((url) => !(url in before));
      const results = await Promise.all(
        uncached.map((url) => Image.prefetch(url).catch(() => false)),
      );
      add(`prefetched ${results.filter(Boolean).length}/${uncached.length}`);

      const after = (await Image.queryCache?.(urls)) ?? {};
      console.log("[cache] after", after);
      add(`after: ${Object.keys(after).length}/${urls.length} cached`);
      Object.entries(after).forEach(([url, where]) =>
        add(`  ${where}  ${url.slice(-20)}`),
      );
    })();
  }, []);

  // resolveAssetSource tells you which @Nx file the bundler picked (native only).
  const asset =
    Platform.OS === "web" ? null : Image.resolveAssetSource(DENSITY_MARKER);

  return (
    <FlatList
      data={PHOTOS}
      keyExtractor={(photo) => photo.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <PhotoTile photo={item} />
        </View>
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.heading}>1. Density marker (@1x/@2x/@3x)</Text>
          <View style={styles.inline}>
            <Image source={DENSITY_MARKER} style={styles.marker} />
            <Text style={styles.line}>
              PixelRatio: {PixelRatio.get()}
              {"\n"}
              {asset
                ? `asset scale: ${asset.scale} · ${asset.width}×${asset.height}`
                : "asset scale: n/a on web"}
            </Text>
          </View>

          <Text style={styles.heading}>2. Avatar</Text>
          <View style={styles.inline}>
            <Avatar uri={AVATAR_URI} size={64} />
            <Avatar uri={AVATAR_URI} size={96} />
            <Image source={{ uri: AVATAR_URI }} style={styles.cornerTest} />
          </View>
          <Text style={styles.line}>
            Right: per-corner radii set directly on Image
          </Text>

          <Text style={styles.heading}>3. Grid</Text>
        </View>
      }
      // The cache log grows as lines arrive, so it lives BELOW the grid:
      // anything that grows above the grid would push the photos down.
      ListFooterComponent={
        <View style={styles.header}>
          <Text style={styles.heading}>4. Cache</Text>
          {log.map((entry) => (
            <Text key={entry.id} style={styles.line}>
              {entry.text}
            </Text>
          ))}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  header: { gap: 10 },
  heading: { fontSize: 16, fontWeight: 600, marginTop: 8 },
  line: { color: "#60646c", fontSize: 13 },
  inline: { flexDirection: "row", alignItems: "center", gap: 16 },
  row: { gap: 12 },
  cell: { flex: 1 },
  marker: { width: 64, height: 64 },
  cornerTest: {
    width: 96,
    height: 96,
    backgroundColor: "#e0e1e6",
    borderTopLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
});
