#!/bin/bash
# SessionStart hook — injects GM expertise context and recent session state

EXPERTISE_FILE="${CLAUDE_PLUGIN_ROOT}/world/expertise.yaml"
CAMPAIGN_FILE="${CLAUDE_PLUGIN_ROOT}/world/campaign-context.md"
SESSION_LOG="${CLAUDE_PLUGIN_ROOT}/world/session-log.md"

if [ -f "$EXPERTISE_FILE" ]; then
  echo "<gm_expertise>"
  cat "$EXPERTISE_FILE"
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
  tail -20 "$SESSION_LOG"
  echo "</recent_session_log>"
  echo ""
fi
