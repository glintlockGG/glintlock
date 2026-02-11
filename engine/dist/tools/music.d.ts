export interface MusicParams {
    action: "play" | "stop" | "change";
    prompt?: string;
    duration_seconds?: number;
    volume?: number;
    loop?: boolean;
    force_instrumental?: boolean;
    output_path?: string;
}
export interface MusicResult {
    playing: boolean;
    rendered?: boolean;
    prompt?: string;
    output_path?: string;
    duration_ms?: number;
    error?: string;
}
export declare function playMusic(params: MusicParams): Promise<MusicResult>;
//# sourceMappingURL=music.d.ts.map