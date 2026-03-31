# 016 - Server Component Event Handlers Crash

**Date**: 2026-03-31
**Severity**: High

## Symptom
The Next.js application crashed completely on the `/portfolio` page with the error:
`Error: Event handlers cannot be passed to Client Component props.`
Specifically complaining about an `onError` attribute attached to an `<img>` tag:
`<img src=... alt=... className=... onError={function onError}>`

## Root Cause
Next.js App Router defaults to rendering React Server Components (RSCs) on the server. Because these components are evaluated long before they hit the browser, they cannot contain browser-specific interactive code, hook lifecycle events like `useEffect`, or JavaScript event listeners like `onClick`, `onChange`, or `onError`.

In `src/app/(site)/portfolio/page.tsx`, an inline fallback function was passed to hide broken generic images (`onError={(e) => { e.currentTarget.style.display = "none"; }}`). This broke the serialization boundary.

## The Fix
RSC boundaries must be intentionally broken when pushing interactivity to the client. The fix involves refactoring the image rendering logic out of the Server Component and into an explicit Client Component.

1. **Created a dedicated boundary**: `src/app/(site)/portfolio/ClientLogo.tsx`
2. **Marked with `"use client"`**:
   ```tsx
   "use client";
   export function ClientLogo({ src, alt }: { src: string; alt: string }) {
     return <img src={src} alt={alt} onError={(e) => e.currentTarget.style.display = "none"} />;
   }
   ```
3. **Imported to the server module**:
   ```tsx
   // Replace <img ... onError={...} /> in `page.tsx` with:
   <ClientLogo src={project.logo} alt={`${project.title} logo`} />
   ```

## Key Rule
Never bind browser event listeners (e.g., `onClick`, `onError`) directly inside a Next.js Server Component; abstract the interactive element into a dedicated `"use client"` micro-component.

## Files Involved
- `src/app/(site)/portfolio/page.tsx`
- `src/app/(site)/portfolio/ClientLogo.tsx`
