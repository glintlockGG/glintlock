export interface TtsParams {
    text: string;
    voice_id?: string;
    language_code?: string;
    speed?: number;
    stability?: number;
    similarity_boost?: number;
    style?: number;
    output_path?: string;
}
export interface TtsResult {
    spoken: boolean;
    rendered?: boolean;
    text_length: number;
    voice_id: string;
    output_path?: string;
    duration_ms?: number;
    error?: string;
}
export declare function ttsNarrate(params: TtsParams): Promise<TtsResult>;
//# sourceMappingURL=tts.d.ts.map