# Date: Sun Mar 29 23:26:05 +06 2026
# Severity: Low
# Symptom: The final argument passed to useEffect changed size between renders.
# Root Cause: Fast Refresh crashes when the dependency array of useEffect physically changes size in code between renders (e.g. adding suggestions.length while hot reloading).
# The Fix: Replaced complex object expansion and properties with a stable stringified representation JSON.stringify(fm) to ensure array length stays absolutely constant.
# Key Rule: Use stringified JSON or exact primitive properties in dependency arrays for complex objects that map structurally if size can change.
# Files Involved: PromptSidebar.tsx

