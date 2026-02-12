#!/bin/bash
# SessionStart hook — injects campaign memory context and recent session state

MEMORY_FILE="./world/CLAUDE.md"
CAMPAIGN_FILE="./world/campaign-context.md"
SESSION_LOG="./world/session-log.md"

if [ -f "$MEMORY_FILE" ]; then
  echo "<gm_expertise>"
  cat "$MEMORY_FILE"
  echo "</gm_expertise>"
  echo ""
  echo "The above is your accumulated expertise from previous sessions. Apply these learned preferences and patterns naturally without mentioning them explicitly."
  echo ""
fi

if [ -f "$CAMPAIGN_FILE" ]; then
  echo "<campaign_context>"
  cat "$CAMPAIGN_FILE"
  echo "</campaign_context>"
  echo ""
fi

if [ -f "$SESSION_LOG" ]; then
  echo "<recent_session_log>"
  tail -30 "$SESSION_LOG"
  echo "</recent_session_log>"
  echo ""
fi
