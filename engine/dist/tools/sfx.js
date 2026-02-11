import { spawn } from "node:child_process";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { getAudioDurationMs } from "./audio-utils.js";
export async function generateSfx(params) {
    const { text, duration_seconds, prompt_influence, output_path } = params;
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
        return {
            played: false,
            text,
            error: "ELEVENLABS_API_KEY not set. Sound effects disabled.",
        };
    }
    let audioBuffer;
    try {
        const body = {
            text,
            model_id: "eleven_text_to_sound_v2",
        };
        if (duration_seconds != null)
            body.duration_seconds = duration_seconds;
        if (prompt_influence != null)
            body.prompt_influence = prompt_influence;
        const res = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
            method: "POST",
            headers: {
                "xi-api-key": apiKey,
                "Content-Type": "application/json",
                Accept: "audio/mpeg",
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const errBody = await res.text().catch(() => "");
            return {
                played: false,
                text,
                error: `ElevenLabs API error ${res.status}: ${errBody}`,
            };
        }
        audioBuffer = await res.arrayBuffer();
    }
    catch (err) {
        return {
            played: false,
            text,
            error: `ElevenLabs request failed: ${err.message}`,
        };
    }
    // If output_path is set: save to that path, skip playback, return duration
    if (output_path) {
        await mkdir(dirname(output_path), { recursive: true });
        await writeFile(output_path, Buffer.from(audioBuffer));
        let duration_ms;
        try {
            duration_ms = await getAudioDurationMs(output_path);
        }
        catch {
            duration_ms = duration_seconds ? Math.round(duration_seconds * 1000) : undefined;
        }
        return {
            played: false,
            rendered: true,
            text,
            duration_seconds,
            output_path,
            duration_ms,
        };
    }
    const tmpPath = join(tmpdir(), `glintlock-sfx-${Date.now()}.mp3`);
    await writeFile(tmpPath, Buffer.from(audioBuffer));
    const playerCmd = getAudioPlayer(tmpPath);
    if (!playerCmd) {
        unlink(tmpPath).catch(() => { });
        return {
            played: false,
            text,
            error: `No audio player found for platform: ${process.platform}`,
        };
    }
    const child = spawn(playerCmd.cmd, playerCmd.args, {
        detached: true,
        stdio: "ignore",
    });
    child.unref();
    child.on("exit", () => {
        unlink(tmpPath).catch(() => { });
    });
    return {
        played: true,
        text,
        duration_seconds,
    };
}
function getAudioPlayer(filePath) {
    switch (process.platform) {
        case "darwin":
            return { cmd: "afplay", args: [filePath] };
        case "linux":
            return { cmd: "paplay", args: [filePath] };
        case "win32":
            return {
                cmd: "powershell",
                args: ["-c", `(New-Object Media.SoundPlayer '${filePath}').PlaySync()`],
            };
        default:
            return null;
    }
}
//# sourceMappingURL=sfx.js.map