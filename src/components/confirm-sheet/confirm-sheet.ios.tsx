import { useEffect, useEffectEvent } from "react";
import { ActionSheetIOS } from "react-native";

import { type ConfirmSheetProps } from "./types";

// iOS: the real UIKit action sheet. It is imperative, so we open it from an effect
// and render nothing ourselves.
export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  // useEffectEvent: reads the latest props without making the effect re-run
  // (and re-open the sheet) every time the parent passes new callbacks.
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
