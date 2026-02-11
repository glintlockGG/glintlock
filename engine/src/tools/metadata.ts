import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

export interface SessionMetadata {
  sessions_played: number;
  last_played: string;
  campaign_created: string;
}

const defaultMetadata: SessionMetadata = {
  sessions_played: 0,
  last_played: new Date().toISOString().slice(0, 10),
  campaign_created: new Date().toISOString().slice(0, 10),
};

function getMetadataPath(): string {
  const worldDir = process.env.GLINTLOCK_WORLD_DIR || "./world";
  return join(worldDir, "session-metadata.json");
}

export function getSessionMetadata(): SessionMetadata {
  const path = getMetadataPath();
  try {
    const raw = readFileSync(path, "utf-8");
    return JSON.parse(raw) as SessionMetadata;
  } catch {
    return { ...defaultMetadata };
  }
}

export function updateSessionMetadata(
  updates: Partial<SessionMetadata>
): SessionMetadata {
  const current = getSessionMetadata();
  const merged = { ...current, ...updates };
  const path = getMetadataPath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(merged, null, 2) + "\n");
  return merged;
}
