# Native Alert & Confirm Replacement

**Date:** 2026-03-31
**Severity:** Medium

## Symptom
The UI employed standard browser `window.alert` and `window.confirm` dialogues which feel unpolished in a premium application context. They halt execution across the entire thread asynchronously, break the site's aesthetic standard, and are prone to causing Next.js client-side inconsistencies or test hanging.

## Root Cause
Native browser dialogues (`alert()` and `confirm()`) block the main JS thread and step outside the React DOM tree rendering. They cannot be styled, conflict with immersive high-end AI dashboard aesthetics, and explicitly violate the GEMINI.md project rule: `// Alerts/Modals: NEVER use browser window.alert or window.confirm.`

## The Fix
Replaced all scattered `alert` and `confirm` calls in `src/app/(site)/dashboard/page.tsx` with a shared custom React state `dialogState`. Created helper functions `showAlert` and `showConfirm` to interact with this state cleanly. Added a `<div className="fixed inset-0...">` overlay at the bottom of the component to dynamically render a beautiful Tailwind-styled alert/confirm modal matching the app's dark theme and accent colors. For actions triggered through confirmations, state transitions (like optimistic updates followed by backend syncs or reversions on error) were refined.

## Key Rule
NEVER use `window.alert` or `window.confirm`. Always create or use an established global/local React Modal state to collect non-blocking user decisions visually coherently.

## Files Involved
- `src/app/(site)/dashboard/page.tsx`
