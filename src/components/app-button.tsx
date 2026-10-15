import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type Insets,
} from "react-native";

type Variant = "primary" | "secondary" | "danger";

const COLORS: Record<Variant, { bg: string; text: string; ripple: string }> = {
  primary: { bg: "#3c87f7", text: "#ffffff", ripple: "#ffffff55" },
  secondary: { bg: "#e0e1e6", text: "#11181c", ripple: "#00000022" },
  danger: { bg: "#e5484d", text: "#ffffff", ripple: "#ffffff55" },
};

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  hitSlop?: number | Insets;
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  hitSlop,
}: AppButtonProps) {
  const colors = COLORS[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      android_ripple={{ color: colors.ripple }}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      hitSlop={hitSlop}
      unstable_pressDelay={0}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: colors.bg },
        inactive && styles.inactive,
        pressed && Platform.OS === "ios" && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={[styles.text, { color: colors.text }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  text: {
    fontSize: 16,
    fontWeight: 600,
  },
  pressed: {
    opacity: 0.6,
  },
  inactive: {
    opacity: 0.4,
  },
});
