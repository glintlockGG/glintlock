/**
 * mix_audiobook — Uses ffmpeg to produce a final mixed audiobook MP3.
 *
 * Mixing phases:
 * 1. Spine: concatenate all speech segments with gaps
 * 2. Music bed: loop/trim scene music, low volume, crossfade between scenes
 * 3. SFX placement: position SFX at calculated timestamps
 * 4. Final mix: layer spine + music + SFX, apply fade-in/fade-out
 */
import { execFile } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import { promisify } from "node:util";
import { join, dirname } from "node:path";
import { getAudioDurationMs, generateSilence } from "./audio-utils.js";
const execFileAsync = promisify(execFile);
const SEGMENT_GAP_MS = 300;
const SCENE_BREAK_MS = 2000;
const MUSIC_VOLUME = 0.15;
const FADE_IN_MS = 500;
const FADE_OUT_MS = 1000;
export async function mixAudiobook(params) {
    const { manifest, build_dir, output_path } = params;
    try {
        await mkdir(dirname(output_path), { recursive: true });
        await mkdir(build_dir, { recursive: true });
        // Phase 1: Build the speech spine
        const spinePath = join(build_dir, "spine.mp3");
        await buildSpine(manifest, build_dir, spinePath);
        const spineDuration = await getAudioDurationMs(spinePath);
        // Phase 2: Build music bed (if any scenes have music)
        const hasMusic = manifest.scenes.some((s) => s.music_file_path);
        let musicBedPath;
        if (hasMusic) {
            musicBedPath = join(build_dir, "music-bed.mp3");
            await buildMusicBed(manifest, build_dir, musicBedPath, spineDuration);
        }
        // Phase 3: Collect SFX with timestamps
        const sfxEntries = collectSfxTimestamps(manifest);
        // Phase 4: Mix variants
        // Derive variant paths from output_path: "foo.mp3" → "foo.narration.mp3", "foo.no-music.mp3"
        const variantPath = (variant) => {
            if (variant === "full")
                return output_path;
            return output_path.replace(/\.mp3$/i, `.${variant}.mp3`);
        };
        const outputs = [];
        // Full mix: spine + music + SFX
        const fullPath = variantPath("full");
        await finalMix(spinePath, musicBedPath, sfxEntries, fullPath, spineDuration);
        outputs.push({ variant: "full", path: fullPath, duration_ms: await getAudioDurationMs(fullPath) });
        // Narration only: spine with fade, no music, no SFX
        const narrationPath = variantPath("narration");
        await finalMix(spinePath, undefined, [], narrationPath, spineDuration);
        outputs.push({ variant: "narration", path: narrationPath, duration_ms: await getAudioDurationMs(narrationPath) });
        // No-music: spine + SFX, no music bed
        if (sfxEntries.length > 0) {
            const noMusicPath = variantPath("no-music");
            await finalMix(spinePath, undefined, sfxEntries, noMusicPath, spineDuration);
            outputs.push({ variant: "no-music", path: noMusicPath, duration_ms: await getAudioDurationMs(noMusicPath) });
        }
        return {
            success: true,
            outputs,
        };
    }
    catch (err) {
        return {
            success: false,
            error: `Mix failed: ${err.message}`,
        };
    }
}
/**
 * Phase 1: Concatenate speech chunks with silence gaps into a single spine track.
 */
async function buildSpine(manifest, buildDir, outputPath) {
    const concatListPath = join(buildDir, "concat-list.txt");
    const silenceSegPath = join(buildDir, "silence-seg.mp3");
    const silenceScenePath = join(buildDir, "silence-scene.mp3");
    // Generate silence files
    await generateSilence(silenceSegPath, SEGMENT_GAP_MS);
    await generateSilence(silenceScenePath, SCENE_BREAK_MS);
    // Build concat list
    const lines = [];
    for (let si = 0; si < manifest.scenes.length; si++) {
        const scene = manifest.scenes[si];
        if (si > 0) {
            lines.push(`file '${silenceScenePath}'`);
        }
        for (let segi = 0; segi < scene.segments.length; segi++) {
            const segment = scene.segments[segi];
            if (segi > 0) {
                lines.push(`file '${silenceSegPath}'`);
            }
            for (const chunk of segment.chunks) {
                if (chunk.file_path) {
                    lines.push(`file '${chunk.file_path}'`);
                }
            }
        }
    }
    await writeFile(concatListPath, lines.join("\n"));
    await execFileAsync("ffmpeg", [
        "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concatListPath,
        "-c:a", "libmp3lame",
        "-q:a", "2",
        outputPath,
    ]);
}
/**
 * Phase 2: Build a music bed by looping/trimming each scene's music track.
 */
async function buildMusicBed(manifest, buildDir, outputPath, totalDurationMs) {
    // Calculate scene start timestamps
    const sceneStarts = [];
    let cursor = 0;
    for (let si = 0; si < manifest.scenes.length; si++) {
        if (si > 0)
            cursor += SCENE_BREAK_MS;
        sceneStarts.push(cursor);
        const scene = manifest.scenes[si];
        for (let segi = 0; segi < scene.segments.length; segi++) {
            if (segi > 0)
                cursor += SEGMENT_GAP_MS;
            for (const chunk of scene.segments[segi].chunks) {
                cursor += chunk.actual_duration_ms || chunk.estimated_duration_ms;
            }
        }
    }
    // Generate individual scene music tracks (looped/trimmed to scene duration)
    const sceneMusicPaths = [];
    for (let si = 0; si < manifest.scenes.length; si++) {
        const scene = manifest.scenes[si];
        if (!scene.music_file_path)
            continue;
        const nextStart = si + 1 < manifest.scenes.length ? sceneStarts[si + 1] : totalDurationMs;
        const sceneDurationMs = nextStart - sceneStarts[si];
        const sceneDurationSec = sceneDurationMs / 1000;
        const sceneMusPath = join(buildDir, `music-scene-${String(si).padStart(2, "0")}-looped.mp3`);
        // Loop the source and trim to scene duration, apply low volume
        await execFileAsync("ffmpeg", [
            "-y",
            "-stream_loop", "-1",
            "-i", scene.music_file_path,
            "-t", String(sceneDurationSec),
            "-af", `volume=${MUSIC_VOLUME}`,
            "-c:a", "libmp3lame",
            "-q:a", "4",
            sceneMusPath,
        ]);
        sceneMusicPaths.push({
            path: sceneMusPath,
            startMs: sceneStarts[si],
            durationMs: sceneDurationMs,
        });
    }
    if (sceneMusicPaths.length === 0)
        return;
    if (sceneMusicPaths.length === 1) {
        // Single scene music — pad with silence to total duration
        const p = sceneMusicPaths[0];
        const silenceBefore = join(buildDir, "music-pad-before.mp3");
        const silenceAfter = join(buildDir, "music-pad-after.mp3");
        if (p.startMs > 0) {
            await generateSilence(silenceBefore, p.startMs);
        }
        const endMs = p.startMs + p.durationMs;
        if (endMs < totalDurationMs) {
            await generateSilence(silenceAfter, totalDurationMs - endMs);
        }
        // Concat: [silence_before] + music + [silence_after]
        const concatList = join(buildDir, "music-concat.txt");
        const lines = [];
        if (p.startMs > 0)
            lines.push(`file '${silenceBefore}'`);
        lines.push(`file '${p.path}'`);
        if (endMs < totalDurationMs)
            lines.push(`file '${silenceAfter}'`);
        await writeFile(concatList, lines.join("\n"));
        await execFileAsync("ffmpeg", [
            "-y", "-f", "concat", "-safe", "0",
            "-i", concatList,
            "-c:a", "libmp3lame", "-q:a", "4",
            outputPath,
        ]);
    }
    else {
        // Multiple scenes — use amix with adelay for positioning
        const inputs = [];
        const filterParts = [];
        for (let i = 0; i < sceneMusicPaths.length; i++) {
            inputs.push("-i", sceneMusicPaths[i].path);
            const delayMs = sceneMusicPaths[i].startMs;
            filterParts.push(`[${i}]adelay=${delayMs}|${delayMs}[m${i}]`);
        }
        const mixInputs = sceneMusicPaths.map((_, i) => `[m${i}]`).join("");
        const filterGraph = [
            ...filterParts,
            `${mixInputs}amix=inputs=${sceneMusicPaths.length}:duration=longest`,
        ].join(";");
        await execFileAsync("ffmpeg", [
            "-y",
            ...inputs,
            "-filter_complex", filterGraph,
            "-c:a", "libmp3lame", "-q:a", "4",
            outputPath,
        ]);
    }
}
/**
 * Phase 3: Calculate SFX timestamps based on segment positions in the spine.
 */
function collectSfxTimestamps(manifest) {
    const entries = [];
    let cursor = 0;
    for (let si = 0; si < manifest.scenes.length; si++) {
        if (si > 0)
            cursor += SCENE_BREAK_MS;
        const scene = manifest.scenes[si];
        for (let segi = 0; segi < scene.segments.length; segi++) {
            if (segi > 0)
                cursor += SEGMENT_GAP_MS;
            const segment = scene.segments[segi];
            const segStart = cursor;
            for (const chunk of segment.chunks) {
                cursor += chunk.actual_duration_ms || chunk.estimated_duration_ms;
            }
            if (segment.sfx_file_path && segment.sfx_duration_ms) {
                entries.push({
                    filePath: segment.sfx_file_path,
                    timestampMs: segStart,
                    durationMs: segment.sfx_duration_ms,
                });
            }
        }
    }
    return entries;
}
/**
 * Phase 4: Layer spine + music bed + SFX, apply fade-in/fade-out.
 */
async function finalMix(spinePath, musicBedPath, sfxEntries, outputPath, totalDurationMs) {
    const totalDurationSec = totalDurationMs / 1000;
    const fadeOutStart = Math.max(0, totalDurationSec - FADE_OUT_MS / 1000);
    // Simple case: spine only
    if (!musicBedPath && sfxEntries.length === 0) {
        await execFileAsync("ffmpeg", [
            "-y",
            "-i", spinePath,
            "-af", `afade=t=in:st=0:d=${FADE_IN_MS / 1000},afade=t=out:st=${fadeOutStart}:d=${FADE_OUT_MS / 1000}`,
            "-c:a", "libmp3lame", "-q:a", "2",
            outputPath,
        ]);
        return;
    }
    // Build complex filter graph
    const inputs = ["-i", spinePath];
    let inputIndex = 1;
    const filterParts = [];
    // Spine is input [0]
    filterParts.push(`[0]afade=t=in:st=0:d=${FADE_IN_MS / 1000},afade=t=out:st=${fadeOutStart}:d=${FADE_OUT_MS / 1000}[spine]`);
    let mixInputs = "[spine]";
    let mixCount = 1;
    if (musicBedPath) {
        inputs.push("-i", musicBedPath);
        const mi = inputIndex++;
        filterParts.push(`[${mi}]apad=whole_dur=${totalDurationSec}[music]`);
        mixInputs += "[music]";
        mixCount++;
    }
    for (let i = 0; i < sfxEntries.length; i++) {
        const sfx = sfxEntries[i];
        inputs.push("-i", sfx.filePath);
        const si = inputIndex++;
        filterParts.push(`[${si}]adelay=${sfx.timestampMs}|${sfx.timestampMs}[sfx${i}]`);
        mixInputs += `[sfx${i}]`;
        mixCount++;
    }
    if (mixCount > 1) {
        filterParts.push(`${mixInputs}amix=inputs=${mixCount}:duration=first:dropout_transition=0`);
    }
    const filterGraph = filterParts.join(";");
    await execFileAsync("ffmpeg", [
        "-y",
        ...inputs,
        "-filter_complex", filterGraph,
        "-c:a", "libmp3lame", "-q:a", "2",
        outputPath,
    ]);
}
//# sourceMappingURL=audiobook-mixer.js.map