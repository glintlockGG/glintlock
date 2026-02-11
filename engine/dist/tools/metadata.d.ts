export interface SessionMetadata {
    sessions_played: number;
    last_played: string;
    campaign_created: string;
}
export declare function getSessionMetadata(): SessionMetadata;
export declare function updateSessionMetadata(updates: Partial<SessionMetadata>): SessionMetadata;
//# sourceMappingURL=metadata.d.ts.map