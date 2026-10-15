# Fast Refresh Drill — Findings

Recorded 2026-10-15 on Expo SDK 57 / RN 0.86, Expo web (Metro, same Fast Refresh runtime as native).
Screen: `src/app/drill.tsx` (Drill tab). Evidence: [`evidence/`](./evidence/) — video, before/after screenshots, raw `transcript.txt`.

## The three rules

| # | Rule (React Native Fast Refresh docs) |
|---|---|
| **R1** | Edit a module that exports **only React components** → only that module updates; state is kept. |
| **R2** | Edit a module with **non-component exports** → that module **and the modules importing it** re-run. |
| **R3** | Edit a module imported by **modules outside the React tree** → **full reload**. |

How to read the logs: `module evaluated` = the file re-ran. `cleanup → mounted` = the effect re-ran (same component). `mounted` with **no** `cleanup` = page reloaded.

## Observations

Counts are shown as case 1 / case 2 / case 3.

| Step | What was edited | Before → after | Logs | Rule |
|---|---|---|---|---|
| Case 1 | `case-1-component-only-screen.tsx` | 2/3/4 → **2/3/4** | `[case-1]` evaluated, cleanup, mounted | **R1** — exports only `CaseOneScreen` |
| Case 2 | `THEME.accent` in `case-2-component-and-theme-screen.tsx` | 2/3/4 → **2/3/4** | `[case-2]` evaluated, cleanup, mounted | **R2** — not a boundary itself, but its importer `drill.tsx` exports only a component and absorbs the update, so state survives |
| Case 2b | `drill.tsx` (route) after adding `export const THEME` to it | 2/3/4 → **0/0/0** | cleanup + mounted for all three, no `evaluated` | **R2** — the route is no longer a boundary; the update climbs to Expo Router, which **remounts** the screen (not a reload) |
| Case 3 (before) | `case-3-…-screen.tsx` while `format-count-label.ts` imports its `THEME` | 2/3/4 → **0/0/0** | every module evaluated, mounted with **no cleanup**, `Require cycle` warning | **R3** — the update climbs into a non-React utility (outside the React tree, cycling back to case 3) → **full reload** that wipes even cases 1 & 2 |
| Case 3 (after refactor) | same file | 2/3/4 → **2/3/4** | `[case-3]` evaluated, cleanup, mounted | **R1** restored |

**Takeaway:** a mixed export only breaks refresh if nothing above it is a boundary (case 2 vs 2b). A component file that non-React code imports from always breaks it (case 3).

## Case 3 refactor — partial refresh restored

`THEME` moved out of the screen into a plain module. Both the screen and the utility now import it from there:

```ts
// src/constants/drill-theme.ts
export const CASE_THREE_THEME = { accent: '#E5484D', label: 'Taps' };
```

- The screen exports only `CaseThreeScreen` → it is a refresh boundary again (R1).
- `format-count-label.ts` no longer imports a component file → no cycle, no full reload.
- Proof: edit after the refactor kept **2/3/4**, and only `[case-3]` logged.
  Video: [`evidence/fast-refresh-drill.webm`](./evidence/fast-refresh-drill.webm) from about 1:35 (refactor applied) through 1:45–1:50 (edit, counts stay 2/3/4).
  Screenshots: `05-case-3-broken-*.png` vs `06-case-3-fixed-*.png`.

## `useEffect(() => …, [])` re-runs on every save

Case 1 has `useEffect(() => { console.log('[case-1] mounted'); return () => console.log('[case-1] cleanup'); }, [])`.
It was saved twice in a row:

| Save | Count before | Count after | Logs |
|---|---|---|---|
| #1 | 2 | **2** | `[case-1] cleanup` → `[case-1] mounted` |
| #2 | 2 | **2** | `[case-1] cleanup` → `[case-1] mounted` |

The count is unchanged, so the component did **not** remount. Even so, the empty-deps effect cleaned up and ran again on each save. Fast Refresh deliberately re-runs effects so that edited effect code takes effect. Every effect therefore needs a correct cleanup function.

## Caveats

- Recorded on web only. Native uses the same Metro and React Refresh runtime, but repeat the steps in Expo Go to confirm.
- In the video, the case 3 card label still says "THEME imported by a utility" after the refactor. The label was changed in code afterwards.
