import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Case 1: this file exports ONLY a React component → it is a Fast Refresh boundary.
console.log('[case-1] module evaluated');

export function CaseOneScreen() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('[case-1] mounted');
    return () => console.log('[case-1] cleanup');
  }, []);

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="smallBold">Case 1 · component only</ThemedText>
      <Pressable testID="case-1-button" onPress={() => setCount((c) => c + 1)}>
        <ThemedText type="subtitle" testID="case-1-count">
          Count: {count}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 16, gap: 8, alignSelf: 'stretch' },
});
