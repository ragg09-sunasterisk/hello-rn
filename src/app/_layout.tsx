import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Appearance, Platform, useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { NotesProvider } from "@/providers/notes-provider";

SplashScreen.preventAutoHideAsync();
if (Platform.OS !== "web") Appearance.setColorScheme("light");

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <NotesProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="compose"
            options={{ presentation: "modal", title: "New note" }}
          />
        </Stack>
      </ThemeProvider>
    </NotesProvider>
  );
}
