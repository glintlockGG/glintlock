import { spawn } from "node:child_process";
import { writeFile, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const DEFAULT_VOICE_ID = "w8SDQBLZWRZYxv1YDGss"; // Glintlock narrator voice

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

export async function ttsNarrate(params: TtsParams): Promise<TtsResult> {
  const { text, speed } = params;
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
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
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
