/**
 * render_audiobook — Parses a chronicle chapter into an AudioManifest.
 * Supports two input modes:
 *   1. annotated_scenes — Agent pre-annotates dialogue/narration (preferred)
 *   2. chapter_markdown — Regex-based fallback parsing
 */
export interface AudioChunk {
    id: string;
    text: string;
    voice_id: string;
    voice_label: string;
    estimated_duration_ms: number;
    file_path?: string;
    actual_duration_ms?: number;
}
export interface AudioSegment {
    id: string;
    scene_index: number;
    type: "narration" | "dialogue" | "epigraph";
    speaker?: string;
    chunks: AudioChunk[];
    sfx_cue?: string;
    sfx_file_path?: string;
    sfx_duration_ms?: number;
}
export interface AudioScene {
    index: number;
    segments: AudioSegment[];
    music_cue?: string;
    music_file_path?: string;
    music_duration_ms?: number;
    estimated_duration_ms: number;
}
export interface AudioManifest {
    chapter_number: number;
    chapter_title: string;
    language_code?: string;
    scenes: AudioScene[];
    total_estimated_duration_ms: number;
    total_chunks: number;
    voices_used: Record<string, string>;
}
export interface AnnotatedSegment {
    type: "narration" | "dialogue" | "epigraph";
    text: string;
    speaker?: string;
}
export interface AnnotatedScene {
    segments: AnnotatedSegment[];
}
export interface RenderAudiobookParams {
    chapter_markdown: string;
    chapter_number: number;
    chapter_title: string;
    language_code?: string;
    narrator_voice_id?: string;
    voices?: Record<string, string>;
    annotated_scenes?: AnnotatedScene[];
}
export declare function renderAudiobook(params: RenderAudiobookParams): AudioManifest;
//# sourceMappingURL=audiobook.d.ts.map