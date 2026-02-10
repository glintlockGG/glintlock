import db from "../db.js";
import { loadComponents } from "./ecs.js";

export interface SessionSummaryParams {
  detail_level?: "brief" | "full";
}

export function getSessionSummary(params: SessionSummaryParams) {
  const detail = params.detail_level ?? "brief";

  // Find the PC
  const pc = db.prepare("SELECT * FROM entities WHERE type = 'pc' LIMIT 1").get() as Record<string, unknown> | undefined;

  if (!pc) {
    return {
      status: "no_campaign",
      message: "No player character found. Start a new campaign with /glintlock:new-session.",
      session_count: getSessionCount(),
    };
  }

  const pcComponents = loadComponents(pc.id as string);

  // Current location
  let currentLocation = null;
  const locationId = pcComponents.position?.location_id as string | undefined;
  if (locationId) {
    const locEntity = db.prepare("SELECT * FROM entities WHERE id = ?").get(locationId) as Record<string, unknown> | undefined;
    if (locEntity) {
      currentLocation = {
        entity: {
          id: locEntity.id,
          type: locEntity.type,
          name: locEntity.name,
        },
        components: loadComponents(locEntity.id as string),
      };
    }
  }

  // NPCs at same location
  let npcsPresent: Array<{ entity: Record<string, unknown>; components: Record<string, Record<string, unknown>> }> = [];
  if (locationId) {
    const npcRows = db.prepare(
      `SELECT e.* FROM entities e
       JOIN position p ON p.entity_id = e.id
       WHERE e.type = 'npc' AND p.location_id = ?`
    ).all(locationId) as Array<Record<string, unknown>>;

    npcsPresent = npcRows.map(row => ({
      entity: { id: row.id, type: row.type, name: row.name },
      components: loadComponents(row.id as string),
    }));
  }

  // Notes
  const noteLimit = detail === "brief" ? 3 : 100;
  const recentNotes = db.prepare(
    "SELECT * FROM notes ORDER BY created_at DESC LIMIT ?"
  ).all(noteLimit) as Array<Record<string, unknown>>;

  const result: Record<string, unknown> = {
    pc: {
      entity: {
        id: pc.id,
        type: pc.type,
        name: pc.name,
        created_at: pc.created_at,
        updated_at: pc.updated_at,
      },
      components: pcComponents,
    },
    current_location: currentLocation,
    npcs_present: npcsPresent,
    recent_notes: recentNotes,
    session_count: getSessionCount(),
  };

  // Full detail: include all locations, NPCs, items, factions
  if (detail === "full") {
    for (const entityType of ["location", "npc", "item", "faction"] as const) {
      const rows = db.prepare("SELECT * FROM entities WHERE type = ?").all(entityType) as Array<Record<string, unknown>>;
      result[`all_${entityType}s`] = rows.map(row => ({
        entity: { id: row.id, type: row.type, name: row.name },
        components: loadComponents(row.id as string),
      }));
    }
  }

  return result;
}

function getSessionCount(): number {
  const row = db.prepare("SELECT value FROM session_meta WHERE key = 'sessions_played'").get() as { value: string } | undefined;
  return row ? parseInt(row.value, 10) : 0;
}
