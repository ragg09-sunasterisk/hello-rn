export type Row = { id: string; name: string };

export const ROW_COUNT = 5000;

export function makeRows(count: number = ROW_COUNT): Row[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `row-${i}`,
    name: `Row ${i + 1}`,
  }));
}
