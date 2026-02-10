#!/bin/bash
# SessionStart hook — injects GM expertise context into the conversation
# The GM agent prompt instructs it to also call get_session_summary as its first action

EXPERTISE_FILE="${CLAUDE_PLUGIN_ROOT}/world/expertise.yaml"

if [ -f "$EXPERTISE_FILE" ]; then
  echo "<gm_expertise>"
  cat "$EXPERTISE_FILE"
  echo "</gm_expertise>"
  echo ""
  echo "The above is your accumulated expertise from previous sessions. Apply these learned preferences and patterns naturally without mentioning them explicitly."
fi
