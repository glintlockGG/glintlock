import db from "../db.js";

type SqlValue = null | number | bigint | string;

const insertNote = db.prepare(
  "INSERT INTO notes (text, entity_id, tag) VALUES (?, ?, ?)"
);

export interface AddNoteParams {
  text: string;
  entity_id?: string;
  tag?: string;
}

export interface AddNoteResult {
  success: boolean;
  note_id: number;
  entity_id?: string;
  tag?: string;
}

export function addNote(params: AddNoteParams): AddNoteResult {
  const { text, entity_id, tag } = params;

  try {
    const info = insertNote.run(text, entity_id ?? null, tag ?? null);
    return {
      success: true,
      note_id: Number(info.lastInsertRowid),
      ...(entity_id ? { entity_id } : {}),
      ...(tag ? { tag } : {}),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("FOREIGN KEY constraint failed")) {
      throw new Error(`Entity "${entity_id}" does not exist.`);
    }
    throw err;
  }
}

// --- query_notes ---

export interface QueryNotesParams {
  entity_id?: string;
  tag?: string;
  text_search?: string;
  limit?: number;
  since?: string;
}

export function queryNotes(params: QueryNotesParams) {
  const { entity_id, tag, text_search, limit = 20, since } = params;
  const conditions: string[] = [];
  const values: SqlValue[] = [];

  if (entity_id) { conditions.push("entity_id = ?"); values.push(entity_id); }
  if (tag) { conditions.push("tag = ?"); values.push(tag); }
  if (text_search) { conditions.push("text LIKE ?"); values.push(`%${text_search}%`); }
  if (since) { conditions.push("created_at > ?"); values.push(since); }

  let sql = "SELECT * FROM notes";
  if (conditions.length > 0) sql += ` WHERE ${conditions.join(" AND ")}`;
  sql += " ORDER BY created_at DESC LIMIT ?";
  values.push(limit);

  const notes = db.prepare(sql).all(...(values as SqlValue[]));
  return { count: notes.length, notes };
}
