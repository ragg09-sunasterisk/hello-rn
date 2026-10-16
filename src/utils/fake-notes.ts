export type Note = { id: string; title: string };

export const NOTES: Note[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  title: `Field note ${i + 1}`,
}));

export function getNote(id: string): Note | undefined {
  return NOTES.find((note) => note.id === id);
}
