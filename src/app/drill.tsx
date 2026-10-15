import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CaseOneScreen } from '@/components/fast-refresh-drill/case-1-component-only-screen';
import { CaseTwoScreen } from '@/components/fast-refresh-drill/case-2-component-and-theme-screen';
import { CaseThreeScreen } from '@/components/fast-refresh-drill/case-3-theme-imported-by-utility-screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

// Fast Refresh drill: tap each counter, edit one case file, then see which counts survive.
export default function DrillScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">Fast Refresh drill</ThemedText>
          <CaseOneScreen />
          <CaseTwoScreen />
          <CaseThreeScreen />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
  safeArea: { flex: 1, maxWidth: MaxContentWidth },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
});
