import { useEffect, useEffectEvent, type ComponentType } from "react";
import {
  ActionSheetIOS,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { type ConfirmSheetProps } from "./types";

// Version A: both platforms in ONE file, chosen with Platform.select.

function IosConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  const showSheet = useEffectEvent(() => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        message,
        options: [confirmLabel, cancelLabel],
        cancelButtonIndex: 1,
        destructiveButtonIndex: destructive ? 0 : undefined,
      },
      (index) => (index === 0 ? onConfirm() : onCancel()),
    );
  });

  useEffect(() => {
    if (visible) showSheet();
  }, [visible]);

  return null;
}

function MaterialConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable
        style={styles.scrim}
        onPress={onCancel}
        accessibilityLabel="Dismiss"
      />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.handle} />
        <Text style={styles.title}>{title}</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Pressable
          onPress={onConfirm}
          accessibilityRole="button"
          style={styles.action}
        >
          <Text style={[styles.actionText, destructive && styles.destructive]}>
            {confirmLabel}
          </Text>
        </Pressable>
        <Pressable
          onPress={onCancel}
          accessibilityRole="button"
          style={styles.action}
        >
          <Text style={styles.actionText}>{cancelLabel}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

// Factory functions + the trailing () — forget it and you render a function.
export const ConfirmSheetSelect = Platform.select<
  () => ComponentType<ConfirmSheetProps>
>({
  ios: () => IosConfirmSheet,
  default: () => MaterialConfirmSheet,
})();

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: "#00000052" },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 8,
    elevation: 16,
  },
  handle: {
    alignSelf: "center",
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#c4c4c8",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    paddingHorizontal: 24,
    color: "#11181c",
  },
  message: {
    fontSize: 14,
    paddingHorizontal: 24,
    paddingTop: 8,
    color: "#60646c",
  },
  action: {
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: 8,
  },
  actionText: { fontSize: 16, color: "#11181c" },
  destructive: { color: "#e5484d", fontWeight: 600 },
});
