import { spawn, ChildProcess } from "node:child_process";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { getAudioDurationMs } from "./audio-utils.js";

let currentMusicProcess: ChildProcess | null = null;
let currentMusicFile: string | null = null;

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

function stopCurrentMusic(): void {
  if (currentMusicProcess) {
    try {
      // Kill the process group (negative PID kills the group)
      if (currentMusicProcess.pid) {
        process.kill(-currentMusicProcess.pid, "SIGTERM");
      }
    } catch {
      // Process may already be dead
      try {
        currentMusicProcess.kill("SIGTERM");
      } catch {
        // ignore
      }
    }
    currentMusicProcess = null;
  }
  if (currentMusicFile) {
    unlink(currentMusicFile).catch(() => {});
    currentMusicFile = null;
  }
}

export async function playMusic(params: MusicParams): Promise<MusicResult> {
  const {
    action,
    prompt,
    duration_seconds = 30,
    volume = 0.25,
    loop = true,
    force_instrumental = true,
    output_path,
  } = params;

  if (action === "stop") {
    stopCurrentMusic();
    return { playing: false };
  }

  // action is "play" or "change" — both need a prompt
  if (!prompt) {
    return {
      playing: false,
      error: "A prompt is required for play/change actions.",
    };
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return {
      playing: false,
      prompt,
      error: "ELEVENLABS_API_KEY not set. Music disabled.",
    };
  }

  // If rendering to file, don't stop current playback
  if (!output_path) {
    stopCurrentMusic();
  }

  let audioBuffer: ArrayBuffer;
  try {
    // API uses music_length_ms — convert our duration_seconds param
    const lengthMs = Math.max(3000, Math.min(600000, duration_seconds * 1000));
    const body: Record<string, unknown> = {
      prompt,
      music_length_ms: lengthMs,
      model_id: "music_v1",
    };
    if (force_instrumental) body.force_instrumental = true;

    const res = await fetch(
      "https://api.elevenlabs.io/v1/music/stream",
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      return {
        playing: false,
        prompt,
        error: `ElevenLabs API error ${res.status}: ${errBody}`,
      };
    }

    audioBuffer = await res.arrayBuffer();
  } catch (err) {
    return {
      playing: false,
      prompt,
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
      duration_ms = duration_seconds * 1000;
    }
    return {
      playing: false,
      rendered: true,
      prompt,
      output_path,
      duration_ms,
    };
  }

  const tmpPath = join(tmpdir(), `glintlock-music-${Date.now()}.mp3`);
  await writeFile(tmpPath, Buffer.from(audioBuffer));
  currentMusicFile = tmpPath;

  const playerCmd = getMusicPlayer(tmpPath, volume, loop);
  if (!playerCmd) {
    unlink(tmpPath).catch(() => {});
    currentMusicFile = null;
    return {
      playing: false,
      prompt,
      error: `No audio player found for platform: ${process.platform}`,
    };
  }

  const child = spawn(playerCmd.cmd, playerCmd.args, {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
  currentMusicProcess = child;

  child.on("exit", () => {
    if (currentMusicFile === tmpPath) {
      unlink(tmpPath).catch(() => {});
      currentMusicFile = null;
      currentMusicProcess = null;
    }
  });

  return {
    playing: true,
    prompt,
  };
}

function getMusicPlayer(
  filePath: string,
  volume: number,
  loop: boolean
): { cmd: string; args: string[] } | null {
  const vol = Math.max(0, Math.min(1, volume));

  switch (process.platform) {
    case "darwin": {
      // afplay has --volume but NO --loops flag — use bash loop for looping
      if (loop) {
        return {
          cmd: "bash",
          args: ["-c", `while true; do afplay --volume ${vol} "${filePath}"; done`],
        };
      }
      return { cmd: "afplay", args: [filePath, "--volume", String(vol)] };
    }
    case "linux": {
      // Use paplay for simple playback (no native loop/volume — wrap in bash loop)
      if (loop) {
        return {
          cmd: "bash",
          args: ["-c", `while true; do paplay "${filePath}"; done`],
        };
      }
      return { cmd: "paplay", args: [filePath] };
    }
    case "win32":
      return {
        cmd: "powershell",
        args: ["-c", `(New-Object Media.SoundPlayer '${filePath}').PlaySync()`],
      };
    default:
      return null;
  }
}
