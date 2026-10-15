// Non-React utility. Imports THEME from a plain constants module, never from a component file.
import { CASE_THREE_THEME as THEME } from '@/constants/drill-theme';

console.log('[format-count-label] module evaluated');

export function formatCountLabel(count: number): string {
  return `${THEME.label}: ${count}`;
}
