import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Case 2: this file exports a component AND a plain constant → NOT a Fast Refresh boundary.
console.log('[case-2] module evaluated');

export const THEME = { accent: '#208AEF' };

export function CaseTwoScreen() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('[case-2] mounted');
    return () => console.log('[case-2] cleanup');
  }, []);

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold">Case 2 · component + THEME export</ThemedText>
      <Pressable testID="case-2-button" onPress={() => setCount((c) => c + 1)}>
        <ThemedText type="subtitle" testID="case-2-count" style={{ color: THEME.accent }}>
          Count: {count}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 16, gap: 8, alignSelf: 'stretch' },
});
