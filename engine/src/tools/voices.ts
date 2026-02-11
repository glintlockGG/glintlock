export interface VoicesParams {
  search?: string;
  category?: "premade" | "cloned" | "generated" | "professional";
  page_size?: number;
}

export interface VoiceEntry {
  voice_id: string;
  name: string;
  description: string | null;
  labels: Record<string, string>;
  preview_url: string | null;
}

export interface VoicesResult {
  voices: VoiceEntry[];
  total: number;
  error?: string;
}

export async function listVoices(params: VoicesParams): Promise<VoicesResult> {
  const { search, category, page_size = 20 } = params;

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return {
      voices: [],
      total: 0,
      error: "ELEVENLABS_API_KEY not set. Voice listing disabled.",
    };
  }

  try {
    const url = new URL("https://api.elevenlabs.io/v2/voices");
    if (search) url.searchParams.set("search", search);
    if (category) url.searchParams.set("category", category);
    url.searchParams.set("page_size", String(Math.max(1, Math.min(100, page_size))));

    const res = await fetch(url.toString(), {
      headers: {
        "xi-api-key": apiKey,
      },
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      return {
        voices: [],
        total: 0,
        error: `ElevenLabs API error ${res.status}: ${errBody}`,
      };
    }

    const data = await res.json() as {
      voices: Array<{
        voice_id: string;
        name: string;
        description: string | null;
        labels: Record<string, string>;
        preview_url: string | null;
      }>;
      total_count?: number;
    };

    const voices: VoiceEntry[] = data.voices.map((v) => ({
      voice_id: v.voice_id,
      name: v.name,
      description: v.description,
      labels: v.labels || {},
      preview_url: v.preview_url,
    }));

    return {
      voices,
      total: data.total_count ?? voices.length,
    };
  } catch (err) {
    return {
      voices: [],
      total: 0,
      error: `ElevenLabs request failed: ${(err as Error).message}`,
    };
  }
}
