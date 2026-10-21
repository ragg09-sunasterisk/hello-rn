// Fallback for every other platform (web) — and the file TypeScript resolves
// for `./confirm-sheet`, since tsc does not understand .ios/.android suffixes.
export { ConfirmSheet } from "./confirm-sheet.android";
