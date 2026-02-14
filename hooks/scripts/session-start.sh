#!/bin/bash
# SessionStart hook — injects soul document, campaign memory, GM notes, and recent session state

SOUL_FILE="${CLAUDE_PLUGIN_ROOT}/SOUL.md"

if [ -f "$SOUL_FILE" ]; then
  echo "<soul>"
  cat "$SOUL_FILE"
  echo "</soul>"
  echo ""
  echo "The above is your soul document — your identity, values, and voice. Internalize it. Do not recite it to the player. Let it shape every decision you make."
  echo ""
fi

MEMORY_FILE="./world/CLAUDE.md"
CAMPAIGN_FILE="./world/campaign-context.md"
SESSION_LOG="./world/session-log.md"
GM_NOTES="./world/gm-notes.md"
CALENDAR_FILE="./world/calendar.md"

if [ -f "$MEMORY_FILE" ]; then
  echo "<campaign_memory>"
  cat "$MEMORY_FILE"
  echo "</campaign_memory>"
  echo ""
  echo "The above is the campaign hot cache — your primary source of campaign state. It contains the PC summary, play style preferences, active threads, doom portent levels, and world state. Use this as your starting context. Drill into individual entity files (characters/, npcs/, locations/) only when you need mechanical details beyond what's here."
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
  tail -50 "$SESSION_LOG"
  echo "</recent_session_log>"
  echo ""

  # Session log rotation advisory
  LOG_LINES=$(wc -l < "$SESSION_LOG" 2>/dev/null | tr -d ' ')
  if [ "$LOG_LINES" -gt 150 ] 2>/dev/null; then
    echo "NOTE: Session log exceeds 150 lines ($LOG_LINES lines). Consider archiving older entries to world/session-log-archive.md during the next world-turn."
    echo ""
  fi
fi

if [ -f "$GM_NOTES" ]; then
  echo "<gm_notes>"
  cat "$GM_NOTES"
  echo "</gm_notes>"
  echo ""
  echo "The above is the GM's prep buffer — strong starts, active secrets, NPC moves, potential scenes, encounters, and treasure. Consult during play. Refresh at narrative pauses."
  echo ""
fi

# Freshness check — advise if world turn is stale
if [ -f "$CALENDAR_FILE" ]; then
  LAST_TURN=$(grep -o 'last_world_turn: [0-9T:Z.+-]*' "$CALENDAR_FILE" 2>/dev/null | head -1 | sed 's/last_world_turn: //')
  if [ -n "$LAST_TURN" ]; then
    # Convert to epoch seconds for comparison (macOS date -j)
    TURN_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%S" "${LAST_TURN%.*}" "+%s" 2>/dev/null || date -d "$LAST_TURN" "+%s" 2>/dev/null)
    NOW_EPOCH=$(date "+%s")
    if [ -n "$TURN_EPOCH" ] && [ -n "$NOW_EPOCH" ]; then
      HOURS_SINCE=$(( (NOW_EPOCH - TURN_EPOCH) / 3600 ))
      if [ "$HOURS_SINCE" -gt 6 ] 2>/dev/null; then
        echo "ADVISORY: Last world turn was ${HOURS_SINCE} hours ago. The world may need advancing — consider running world-advance during /glintlock:resume or /glintlock:world-turn."
        echo ""
      fi
    fi
  fi
fi

# Play resumption directive
if [ -d "./world" ] && [ -f "$MEMORY_FILE" ]; then
  echo "An active campaign exists. If the player starts talking without running a command, auto-resume: load context from the hot cache above, check if world-advance is needed, and deliver a strong start from gm-notes. You can also run /glintlock:resume for the full resumption flow."
  echo ""
fi
