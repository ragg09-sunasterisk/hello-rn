import { Image, StyleSheet, View } from "react-native";

type Props = {
  uri: string;
  size?: number;
};

export function Avatar({ uri, size = 64 }: Props) {
  return (
    <View
      style={[
        styles.frame,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: "hidden", backgroundColor: "#e0e1e6" },
  image: { width: "100%", height: "100%" },
});
