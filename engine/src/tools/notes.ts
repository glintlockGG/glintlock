import db from "../db.js";

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
