#!/bin/bash
# Glintlock MCP Engine startup
# Dependencies are pre-bundled — no npm install needed

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENGINE_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ENGINE_DIR"

# Self-locate oracle tables if env var is unset or points to nonexistent file
if [ -z "$GLINTLOCK_ORACLE_PATH" ] || [ ! -f "$GLINTLOCK_ORACLE_PATH" ]; then
  export GLINTLOCK_ORACLE_PATH="$ENGINE_DIR/data/oracle-tables.json"
fi

# Startup diagnostics (stderr — doesn't interfere with MCP stdio)
echo "[glintlock-engine] starting from $ENGINE_DIR" >&2
echo "[glintlock-engine] oracle=$GLINTLOCK_ORACLE_PATH" >&2
echo "[glintlock-engine] elevenlabs=$([ -n "$ELEVENLABS_API_KEY" ] && echo 'set' || echo 'not set')" >&2

exec node dist/index.js
