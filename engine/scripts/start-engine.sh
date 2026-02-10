#!/bin/bash
# Glintlock MCP Engine startup
# Dependencies are pre-bundled — no npm install needed

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENGINE_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ENGINE_DIR"

exec node --experimental-sqlite dist/index.js
