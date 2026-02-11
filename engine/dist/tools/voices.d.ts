export interface VoicesParams {
    search?: string;
    category?: "premade" | "cloned" | "generated" | "professional";
    page_size?: number;
}
export interface VoiceEntry {
    voice_id: string;
    name: string;
    description: string | null;
    labels: Record<string, string>;
    preview_url: string | null;
}
export interface VoicesResult {
    voices: VoiceEntry[];
    total: number;
    error?: string;
}
export declare function listVoices(params: VoicesParams): Promise<VoicesResult>;
//# sourceMappingURL=voices.d.ts.map