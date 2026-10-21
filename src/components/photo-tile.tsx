import { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

import { type Photo } from "@/utils/photos";

const PLACEHOLDER = require("@/assets/images/placeholder.png");

type Props = { photo: Photo };

export function PhotoTile({ photo }: Props) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  return (
    // The box's size is decided BEFORE any bytes arrive: no layout shift.
    <View style={[styles.box, { aspectRatio: photo.width / photo.height }]}>
      <Image
        source={failed ? PLACEHOLDER : { uri: photo.uri }}
        style={styles.image}
        resizeMode={failed ? "contain" : "cover"}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setFailed(true);
          setLoading(false);
        }}
      />
      {loading && <ActivityIndicator style={StyleSheet.absoluteFill} />}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    backgroundColor: "#e0e1e6", // the placeholder colour while loading
    borderRadius: 8,
    overflow: "hidden",
  },
  // A bundled asset carries its own width/height (600×400 here), which would
  // override absoluteFill. Explicit 100% sizes make it fill the box instead.
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});
