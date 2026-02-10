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
export declare function addNote(params: AddNoteParams): AddNoteResult;
export interface QueryNotesParams {
    entity_id?: string;
    tag?: string;
    text_search?: string;
    limit?: number;
    since?: string;
}
export declare function queryNotes(params: QueryNotesParams): {
    count: number;
    notes: Record<string, import("node:sqlite").SQLOutputValue>[];
};
//# sourceMappingURL=notes.d.ts.map