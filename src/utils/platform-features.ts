import { Platform } from "react-native";

// Pure version: takes the values as arguments, so tests can cover both branches
// without faking the Platform module.
export function supportsFeatureXFor(
  os: string,
  version: string | number,
): boolean {
  if (os === "android") {
    // Android: a NUMBER — the API level (31 = Android 12), not "12".
    return typeof version === "number" && version >= 31;
  }
  if (os === "ios") {
    // iOS: a STRING like "17.4.1" — parse the major before comparing.
    const major = parseInt(String(version), 10);
    return !Number.isNaN(major) && major >= 15;
  }
  return false; // web and anything else
}

export function supportsFeatureX(): boolean {
  return supportsFeatureXFor(Platform.OS, Platform.Version);
}
