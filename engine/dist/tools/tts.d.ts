export interface TtsParams {
    text: string;
    voice_id?: string;
    speed?: number;
}
export interface TtsResult {
    spoken: boolean;
    text_length: number;
    voice_id: string;
    error?: string;
}
export declare function ttsNarrate(params: TtsParams): Promise<TtsResult>;
//# sourceMappingURL=tts.d.ts.map