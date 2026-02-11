import { spawn } from "node:child_process";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { getAudioDurationMs } from "./audio-utils.js";

const DEFAULT_VOICE_ID = "w8SDQBLZWRZYxv1YDGss"; // Glintlock narrator voice

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

export async function ttsNarrate(params: TtsParams): Promise<TtsResult> {
  const { text, language_code, speed, stability = 0.5, similarity_boost = 0.75, style, output_path } = params;
  const voiceId = params.voice_id || DEFAULT_VOICE_ID;

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return {
      spoken: false,
      text_length: text.length,
      voice_id: voiceId,
      error: "ELEVENLABS_API_KEY not set. TTS disabled — continuing with text-only narration.",
    };
  }

  // Call ElevenLabs API
  let audioBuffer: ArrayBuffer;
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_v3",
          ...(language_code ? { language_code } : {}),
          voice_settings: {
            stability,
            similarity_boost,
            ...(style != null ? { style } : {}),
            ...(speed != null ? { speed } : {}),
          },
        }),
      }
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        spoken: false,
        text_length: text.length,
        voice_id: voiceId,
        error: `ElevenLabs API error ${res.status}: ${body}`,
      };
    }

    audioBuffer = await res.arrayBuffer();
  } catch (err) {
    return {
      spoken: false,
      text_length: text.length,
      voice_id: voiceId,
      error: `ElevenLabs request failed: ${(err as Error).message}`,
    };
  }

  // If output_path is set: save to that path, skip playback, return duration
  if (output_path) {
    await mkdir(dirname(output_path), { recursive: true });
    await writeFile(output_path, Buffer.from(audioBuffer));
    let duration_ms: number | undefined;
    try {
      duration_ms = await getAudioDurationMs(output_path);
    } catch {
      // ffprobe not available — estimate from text length (~65ms per char)
      duration_ms = Math.round(text.length * 65);
    }
    return {
      spoken: false,
      rendered: true,
      text_length: text.length,
      voice_id: voiceId,
      output_path,
      duration_ms,
    };
  }

  // Write to temp file
  const tmpPath = join(tmpdir(), `glintlock-tts-${Date.now()}.mp3`);
  await writeFile(tmpPath, Buffer.from(audioBuffer));

  // Spawn platform-appropriate audio player (detached, non-blocking)
  const playerCmd = getAudioPlayer(tmpPath);
  if (!playerCmd) {
    // Clean up temp file since we can't play it
    unlink(tmpPath).catch(() => {});
    return {
      spoken: false,
      text_length: text.length,
      voice_id: voiceId,
      error: `No audio player found for platform: ${process.platform}`,
    };
  }

  const child = spawn(playerCmd.cmd, playerCmd.args, {
    detached: true,
    stdio: "ignore",
  });
  child.unref();

  // Clean up temp file after playback finishes
  child.on("exit", () => {
    unlink(tmpPath).catch(() => {});
  });

  return {
    spoken: true,
    text_length: text.length,
    voice_id: voiceId,
  };
}

function getAudioPlayer(filePath: string): { cmd: string; args: string[] } | null {
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
