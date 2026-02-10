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
//# sourceMappingURL=notes.d.ts.map