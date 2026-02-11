/**
 * mix_audiobook — Uses ffmpeg to produce a final mixed audiobook MP3.
 *
 * Mixing phases:
 * 1. Spine: concatenate all speech segments with gaps
 * 2. Music bed: loop/trim scene music, low volume, crossfade between scenes
 * 3. SFX placement: position SFX at calculated timestamps
 * 4. Final mix: layer spine + music + SFX, apply fade-in/fade-out
 */
import type { AudioManifest } from "./audiobook.js";
export interface MixAudiobookParams {
    manifest: AudioManifest;
    build_dir: string;
    output_path: string;
}
export interface MixVariantOutput {
    variant: string;
    path: string;
    duration_ms: number;
}
export interface MixAudiobookResult {
    success: boolean;
    outputs?: MixVariantOutput[];
    error?: string;
}
export declare function mixAudiobook(params: MixAudiobookParams): Promise<MixAudiobookResult>;
//# sourceMappingURL=audiobook-mixer.d.ts.map