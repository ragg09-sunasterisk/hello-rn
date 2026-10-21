import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { render } from "@testing-library/react-native";
import { ActionSheetIOS } from "react-native";

import { ConfirmSheet } from "../confirm-sheet.ios";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("ConfirmSheet (iOS)", () => {
  it("opens the native action sheet with the right options", async () => {
    const show = jest
      .spyOn(ActionSheetIOS, "showActionSheetWithOptions")
      .mockImplementation(() => {});

    await render(
      <ConfirmSheet
        visible
        title="Delete this note?"
        message="This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(show).toHaveBeenCalledTimes(1);
    expect(show.mock.calls[0][0]).toEqual({
      title: "Delete this note?",
      message: "This can't be undone.",
      options: ["Delete", "Cancel"],
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
    });
  });

  it("calls onConfirm for button 0 and onCancel for button 1", async () => {
    const show = jest
      .spyOn(ActionSheetIOS, "showActionSheetWithOptions")
      .mockImplementation(() => {});
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    await render(
      <ConfirmSheet
        visible
        title="t"
        confirmLabel="Delete"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    const pick = show.mock.calls[0][1] as (index: number) => void;

    pick(0);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    pick(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does not open when visible is false", async () => {
    const show = jest
      .spyOn(ActionSheetIOS, "showActionSheetWithOptions")
      .mockImplementation(() => {});
    await render(
      <ConfirmSheet
        visible={false}
        title="t"
        confirmLabel="Delete"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(show).not.toHaveBeenCalled();
  });
});
