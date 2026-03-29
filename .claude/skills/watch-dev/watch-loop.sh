#!/bin/bash
# watch-loop.sh — lightweight dev server log monitor
# Polls /tmp/dev-server.log for errors/warnings, beeps + writes to alert file when found.
# Claude only gets invoked when ALERT_FILE has content.

LOG_FILE="/tmp/dev-server.log"
ALERT_FILE="/tmp/dev-server-alert.txt"
OFFSET_FILE="/tmp/dev-server-offset"
POLL_INTERVAL="${1:-5}"

# Initialize offset tracking
if [[ ! -f "$OFFSET_FILE" ]]; then
  echo "0" > "$OFFSET_FILE"
fi

# Clear any stale alert
> "$ALERT_FILE"

# Error patterns (extended grep)
PATTERNS="error|Error|ERROR|warning|Warning|WARN|failed|Failed|FAIL|TypeError|ReferenceError|SyntaxError|Module not found|Unhandled|Cannot find module|ENOENT|EACCES|EADDRINUSE"

while true; do
  # Check if dev server is still running
  if ! lsof -ti:4000 > /dev/null 2>&1; then
    echo "$(date '+%H:%M:%S') CRITICAL: Dev server on port 4000 is DOWN" > "$ALERT_FILE"
    printf '\a'
    afplay /System/Library/Sounds/Basso.aiff 2>/dev/null &
    # Wait longer before rechecking — give user time to respond
    sleep 30
    continue
  fi

  if [[ ! -f "$LOG_FILE" ]]; then
    sleep "$POLL_INTERVAL"
    continue
  fi

  LAST_OFFSET=$(cat "$OFFSET_FILE" 2>/dev/null || echo "0")
  CURRENT_LINES=$(wc -l < "$LOG_FILE" | tr -d ' ')

  # Only process new lines
  if (( CURRENT_LINES > LAST_OFFSET )); then
    NEW_LINES=$(tail -n +"$((LAST_OFFSET + 1))" "$LOG_FILE" | head -n "$((CURRENT_LINES - LAST_OFFSET))")

    # Check for error patterns
    MATCHES=$(echo "$NEW_LINES" | grep -iE "$PATTERNS" 2>/dev/null)

    if [[ -n "$MATCHES" ]]; then
      # Grab context: the matching lines + a few surrounding lines
      {
        echo "=== ALERT @ $(date '+%H:%M:%S') ==="
        echo "$MATCHES" | head -20
        echo ""
        echo "--- Context (last 10 new lines) ---"
        echo "$NEW_LINES" | tail -10
        echo "=== END ==="
      } > "$ALERT_FILE"

      # Beep!
      printf '\a'
      afplay /System/Library/Sounds/Basso.aiff 2>/dev/null &
    fi

    # Update offset
    echo "$CURRENT_LINES" > "$OFFSET_FILE"
  fi

  sleep "$POLL_INTERVAL"
done
