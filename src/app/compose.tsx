import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/app-button";

export default function ComposeModal() {
  return (
    <View style={styles.screen}>
      <Text>Compose (modal). Android back or swipe down closes it.</Text>
      <AppButton
        title="Close"
        variant="secondary"
        onPress={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 16 },
});
