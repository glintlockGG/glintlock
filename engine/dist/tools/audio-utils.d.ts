/**
 * Get audio file duration in milliseconds using ffprobe.
 */
export declare function getAudioDurationMs(filePath: string): Promise<number>;
/**
 * Generate a silent audio file of the given duration using ffmpeg.
 */
export declare function generateSilence(outputPath: string, durationMs: number): Promise<void>;
//# sourceMappingURL=audio-utils.d.ts.map