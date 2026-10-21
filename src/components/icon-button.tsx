import { Platform, Pressable, StyleSheet, Text } from "react-native";

type IconButtonProps = {
  icon: string;
  label: string;
  onPress: () => void;
  debug?: boolean;
};

const SIZE = 24;
const SLOP = 12; // 24 + 12 + 12 = 48

export function IconButton({
  icon,
  label,
  onPress,
  debug = false,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={SLOP}
      android_ripple={{ color: "#00000022", borderless: true, radius: SIZE }}
      style={({ pressed }) => [
        styles.box,
        pressed && Platform.OS === "ios" && styles.pressed,
        debug && styles.debugBox,
      ]}
    >
      {/* A glyph in a fixed 24×24 box: scaling it would clip it. The meaning is
    already in accessibilityLabel, which screen readers announce. */}
      <Text style={styles.icon} allowFontScaling={false}>
        {icon}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 18,
  },
  pressed: {
    opacity: 0.5,
  },
  debugBox: {
    borderWidth: 1,
    borderColor: "#e5484d",
  },
});
