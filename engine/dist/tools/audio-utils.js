import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);
/**
 * Get audio file duration in milliseconds using ffprobe.
 */
export async function getAudioDurationMs(filePath) {
    const { stdout } = await execFileAsync("ffprobe", [
        "-v", "quiet",
        "-show_entries", "format=duration",
        "-of", "csv=p=0",
        filePath,
    ]);
    const seconds = parseFloat(stdout.trim());
    if (isNaN(seconds)) {
        throw new Error(`ffprobe returned invalid duration for ${filePath}`);
    }
    return Math.round(seconds * 1000);
}
/**
 * Generate a silent audio file of the given duration using ffmpeg.
 */
export async function generateSilence(outputPath, durationMs) {
    const durationSec = durationMs / 1000;
    await execFileAsync("ffmpeg", [
        "-y",
        "-f", "lavfi",
        "-i", `anullsrc=r=44100:cl=mono`,
        "-t", String(durationSec),
        "-q:a", "9",
        outputPath,
    ]);
}
//# sourceMappingURL=audio-utils.js.map