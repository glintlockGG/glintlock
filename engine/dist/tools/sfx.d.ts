export interface SfxParams {
    text: string;
    duration_seconds?: number;
    prompt_influence?: number;
    output_path?: string;
}
export interface SfxResult {
    played: boolean;
    rendered?: boolean;
    text: string;
    duration_seconds?: number;
    output_path?: string;
    duration_ms?: number;
    error?: string;
}
export declare function generateSfx(params: SfxParams): Promise<SfxResult>;
//# sourceMappingURL=sfx.d.ts.map