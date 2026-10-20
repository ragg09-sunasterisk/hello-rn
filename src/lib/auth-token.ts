import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "fieldkit.authToken";

// The real home for the token: Keychain (iOS) / Keystore-encrypted prefs (Android).
export function saveToken(token: string) {
  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export function deleteToken() {
  return SecureStore.deleteItemAsync(TOKEN_KEY);
}

// DEMO ONLY: the same token in AsyncStorage, to prove it is readable in plain text.
export const INSECURE_DEMO_KEY = "INSECURE_DEMO_authToken";

export function saveTokenInsecurelyForDemo(token: string) {
  return AsyncStorage.setItem(INSECURE_DEMO_KEY, token);
}

export function readInsecureDemoToken() {
  return AsyncStorage.getItem(INSECURE_DEMO_KEY);
}

export function deleteInsecureDemoToken() {
  return AsyncStorage.removeItem(INSECURE_DEMO_KEY);
}
