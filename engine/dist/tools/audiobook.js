/**
 * render_audiobook — Parses a chronicle chapter into an AudioManifest.
 * Supports two input modes:
 *   1. annotated_scenes — Agent pre-annotates dialogue/narration (preferred)
 *   2. chapter_markdown — Regex-based fallback parsing
 */
const DEFAULT_NARRATOR_VOICE = "w8SDQBLZWRZYxv1YDGss";
const MS_PER_CHAR = 65;
const MAX_CHUNK_CHARS = 400;
// Dialogue speech verbs
const SPEECH_VERBS = [
    "said", "whispered", "growled", "murmured", "hissed", "shouted",
    "called", "asked", "answered", "replied", "screamed", "breathed",
    "snapped", "barked", "snarled", "croaked", "rasped", "stammered",
    "repeated", "demanded", "announced", "exclaimed", "muttered",
    "added", "continued", "began", "finished", "interrupted",
];
const VERB_PATTERN = SPEECH_VERBS.join("|");
// Matches: "dialogue text," Speaker verb  OR  "dialogue text." Speaker verb
const DIALOGUE_RE = new RegExp(`[\\u201c""]([^\\u201d""]+)[\\u201d""][,.]?\\s+(\\w[\\w\\s]{0,30}?)\\s+(?:${VERB_PATTERN})`, "g");
// Matches any quoted text not already captured
const QUOTE_RE = /[\u201c"""]([^\u201d"""]+)[\u201d"""]/g;
// Pronouns that need resolution
const PRONOUN_SET = new Set(["he", "she", "they", "it"]);
export function renderAudiobook(params) {
    const { chapter_number, chapter_title, language_code, narrator_voice_id = DEFAULT_NARRATOR_VOICE, voices = {}, annotated_scenes, } = params;
    const voicesUsed = {
        [narrator_voice_id]: "Narrator",
    };
    for (const [name, vid] of Object.entries(voices)) {
        voicesUsed[vid] = name;
    }
    // Choose input path
    if (annotated_scenes && annotated_scenes.length > 0) {
        return renderFromAnnotations(annotated_scenes, chapter_number, chapter_title, language_code, narrator_voice_id, voices, voicesUsed);
    }
    return renderFromMarkdown(params, language_code, narrator_voice_id, voices, voicesUsed);
}
// --- Path 1: Agent-annotated scenes ---
function renderFromAnnotations(annotatedScenes, chapterNumber, chapterTitle, languageCode, narratorVoiceId, voices, voicesUsed) {
    let segmentCounter = 0;
    let chunkCounter = 0;
    const scenes = [];
    for (let si = 0; si < annotatedScenes.length; si++) {
        const annotatedScene = annotatedScenes[si];
        const segments = [];
        for (const seg of annotatedScene.segments) {
            const text = seg.text.trim();
            if (!text)
                continue;
            const segId = `seg-${String(++segmentCounter).padStart(3, "0")}`;
            if (seg.type === "dialogue" && seg.speaker) {
                const speaker = normalizeSpeaker(seg.speaker);
                const voiceId = voices[speaker] || narratorVoiceId;
                if (voiceId !== narratorVoiceId) {
                    voicesUsed[voiceId] = speaker;
                }
                segments.push({
                    id: segId,
                    scene_index: si,
                    type: "dialogue",
                    speaker,
                    chunks: chunkText(text, voiceId, speaker, segId, () => ++chunkCounter),
                });
            }
            else {
                segments.push({
                    id: segId,
                    scene_index: si,
                    type: seg.type,
                    chunks: chunkText(text, narratorVoiceId, "Narrator", segId, () => ++chunkCounter),
                });
            }
        }
        const sceneDuration = segments.reduce((sum, s) => sum + s.chunks.reduce((cs, c) => cs + c.estimated_duration_ms, 0), 0);
        scenes.push({
            index: si,
            segments,
            estimated_duration_ms: sceneDuration,
        });
    }
    const totalDuration = scenes.reduce((s, sc) => s + sc.estimated_duration_ms, 0);
    const totalChunks = scenes.reduce((s, sc) => s + sc.segments.reduce((ss, seg) => ss + seg.chunks.length, 0), 0);
    return {
        chapter_number: chapterNumber,
        chapter_title: chapterTitle,
        ...(languageCode ? { language_code: languageCode } : {}),
        scenes,
        total_estimated_duration_ms: totalDuration,
        total_chunks: totalChunks,
        voices_used: voicesUsed,
    };
}
// --- Path 2: Regex-based markdown parsing (fallback) ---
function renderFromMarkdown(params, languageCode, narratorVoiceId, voices, voicesUsed) {
    const { chapter_markdown, chapter_number, chapter_title } = params;
    // Split into scenes on `---` lines
    const rawScenes = chapter_markdown
        .split(/\n---\n/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    let segmentCounter = 0;
    let chunkCounter = 0;
    const scenes = [];
    // Track last named speaker per scene for pronoun resolution
    let lastNamedSpeaker = "";
    for (let si = 0; si < rawScenes.length; si++) {
        const sceneText = rawScenes[si];
        const segments = [];
        lastNamedSpeaker = ""; // reset per scene
        // Split into paragraphs
        const paragraphs = sceneText
            .split(/\n\n+/)
            .map((p) => p.trim())
            .filter((p) => p.length > 0);
        for (const para of paragraphs) {
            // Skip chapter headings
            if (para.startsWith("# "))
                continue;
            // Check for epigraph: *italicized text* (entire paragraph)
            if ((si === 0 || si === rawScenes.length - 1) &&
                /^\*[^*]+\*$/.test(para)) {
                const text = para.replace(/^\*|\*$/g, "");
                const segId = `seg-${String(++segmentCounter).padStart(3, "0")}`;
                segments.push({
                    id: segId,
                    scene_index: si,
                    type: "epigraph",
                    chunks: chunkText(text, narratorVoiceId, "Narrator", segId, () => ++chunkCounter),
                });
                continue;
            }
            // Check for dialogue in the paragraph
            const dialogueMatches = [...para.matchAll(DIALOGUE_RE)];
            // Track which character positions are covered by DIALOGUE_RE matches
            const coveredRanges = [];
            if (dialogueMatches.length > 0) {
                // Split paragraph into narration + dialogue segments
                let lastIndex = 0;
                for (const match of dialogueMatches) {
                    const matchStart = match.index;
                    coveredRanges.push([matchStart, matchStart + match[0].length]);
                    // Narration before the dialogue
                    if (matchStart > lastIndex) {
                        const narrationText = para.slice(lastIndex, matchStart).trim();
                        if (narrationText) {
                            const segId = `seg-${String(++segmentCounter).padStart(3, "0")}`;
                            segments.push({
                                id: segId,
                                scene_index: si,
                                type: "narration",
                                chunks: chunkText(narrationText, narratorVoiceId, "Narrator", segId, () => ++chunkCounter),
                            });
                        }
                    }
                    // The dialogue itself
                    const dialogueText = match[1].trim();
                    const speakerRaw = match[2].trim();
                    // Pronoun resolution
                    let speaker;
                    if (PRONOUN_SET.has(speakerRaw.toLowerCase())) {
                        speaker = lastNamedSpeaker || normalizeSpeaker(speakerRaw);
                    }
                    else {
                        speaker = normalizeSpeaker(speakerRaw);
                        lastNamedSpeaker = speaker;
                    }
                    const voiceId = voices[speaker] || narratorVoiceId;
                    if (voiceId !== narratorVoiceId) {
                        voicesUsed[voiceId] = speaker;
                    }
                    const segId = `seg-${String(++segmentCounter).padStart(3, "0")}`;
                    segments.push({
                        id: segId,
                        scene_index: si,
                        type: "dialogue",
                        speaker,
                        chunks: chunkText(dialogueText, voiceId, speaker, segId, () => ++chunkCounter),
                    });
                    // Find the verb that was matched
                    const afterQuote = para.slice(matchStart + match[0].length - speakerRaw.length);
                    const verbMatch = afterQuote.match(new RegExp(`^${speakerRaw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(${VERB_PATTERN})`));
                    const verb = verbMatch ? verbMatch[1] : "";
                    // Attribution narration
                    lastIndex = matchStart + match[0].length;
                    const afterVerb = para.slice(lastIndex);
                    const sentenceEnd = afterVerb.match(/^[^.!?]*[.!?]\s*/);
                    if (sentenceEnd) {
                        const rest = sentenceEnd[0].trim();
                        if (rest.length > 1) {
                            const attrText = `${speaker} ${verb}${rest.startsWith(",") || rest.startsWith(".") ? "" : " "}${rest}`.trim();
                            const attrSegId = `seg-${String(++segmentCounter).padStart(3, "0")}`;
                            segments.push({
                                id: attrSegId,
                                scene_index: si,
                                type: "narration",
                                chunks: chunkText(attrText, narratorVoiceId, "Narrator", attrSegId, () => ++chunkCounter),
                            });
                        }
                        lastIndex += sentenceEnd[0].length;
                    }
                }
                // Remaining narration after the last dialogue
                const remaining = para.slice(lastIndex).trim();
                if (remaining) {
                    // Check for uncaptured quotes in the remaining text
                    const extraSegments = extractUncapturedQuotes(remaining, coveredRanges, lastIndex, si, narratorVoiceId, voices, voicesUsed, lastNamedSpeaker, () => ++segmentCounter, () => ++chunkCounter);
                    if (extraSegments.length) {
                        segments.push(...extraSegments);
                    }
                    else {
                        const segId = `seg-${String(++segmentCounter).padStart(3, "0")}`;
                        segments.push({
                            id: segId,
                            scene_index: si,
                            type: "narration",
                            chunks: chunkText(remaining, narratorVoiceId, "Narrator", segId, () => ++chunkCounter),
                        });
                    }
                }
            }
            else {
                // No DIALOGUE_RE matches — check for standalone quotes
                const quoteMatches = [...para.matchAll(QUOTE_RE)];
                if (quoteMatches.length > 0) {
                    let lastIndex = 0;
                    for (const qm of quoteMatches) {
                        const qStart = qm.index;
                        // Narration before quote
                        if (qStart > lastIndex) {
                            const narText = para.slice(lastIndex, qStart).trim();
                            if (narText) {
                                const segId = `seg-${String(++segmentCounter).padStart(3, "0")}`;
                                segments.push({
                                    id: segId,
                                    scene_index: si,
                                    type: "narration",
                                    chunks: chunkText(narText, narratorVoiceId, "Narrator", segId, () => ++chunkCounter),
                                });
                            }
                        }
                        // The quote — use last named speaker or "Unknown"
                        const dialogueText = qm[1].trim();
                        const speaker = lastNamedSpeaker || "Unknown";
                        const voiceId = voices[speaker] || narratorVoiceId;
                        if (voiceId !== narratorVoiceId) {
                            voicesUsed[voiceId] = speaker;
                        }
                        const segId = `seg-${String(++segmentCounter).padStart(3, "0")}`;
                        segments.push({
                            id: segId,
                            scene_index: si,
                            type: "dialogue",
                            speaker,
                            chunks: chunkText(dialogueText, voiceId, speaker, segId, () => ++chunkCounter),
                        });
                        lastIndex = qStart + qm[0].length;
                    }
                    // Remaining text
                    const remaining = para.slice(lastIndex).trim();
                    if (remaining) {
                        const segId = `seg-${String(++segmentCounter).padStart(3, "0")}`;
                        segments.push({
                            id: segId,
                            scene_index: si,
                            type: "narration",
                            chunks: chunkText(remaining, narratorVoiceId, "Narrator", segId, () => ++chunkCounter),
                        });
                    }
                }
                else {
                    // Pure narration paragraph
                    const segId = `seg-${String(++segmentCounter).padStart(3, "0")}`;
                    segments.push({
                        id: segId,
                        scene_index: si,
                        type: "narration",
                        chunks: chunkText(para, narratorVoiceId, "Narrator", segId, () => ++chunkCounter),
                    });
                }
            }
        }
        const sceneDuration = segments.reduce((sum, seg) => sum + seg.chunks.reduce((s, c) => s + c.estimated_duration_ms, 0), 0);
        scenes.push({
            index: si,
            segments,
            estimated_duration_ms: sceneDuration,
        });
    }
    const totalDuration = scenes.reduce((s, sc) => s + sc.estimated_duration_ms, 0);
    const totalChunks = scenes.reduce((s, sc) => s + sc.segments.reduce((ss, seg) => ss + seg.chunks.length, 0), 0);
    return {
        chapter_number,
        chapter_title,
        ...(languageCode ? { language_code: languageCode } : {}),
        scenes,
        total_estimated_duration_ms: totalDuration,
        total_chunks: totalChunks,
        voices_used: voicesUsed,
    };
}
/**
 * Extract uncaptured quotes from text that wasn't matched by DIALOGUE_RE.
 * Returns segments for any standalone quoted text found.
 */
function extractUncapturedQuotes(text, _coveredRanges, _offset, sceneIndex, narratorVoiceId, voices, voicesUsed, lastNamedSpeaker, nextSegId, nextChunkId) {
    const segments = [];
    const quoteMatches = [...text.matchAll(QUOTE_RE)];
    if (!quoteMatches.length)
        return segments;
    let lastIndex = 0;
    for (const qm of quoteMatches) {
        const qStart = qm.index;
        // Narration before
        if (qStart > lastIndex) {
            const narText = text.slice(lastIndex, qStart).trim();
            if (narText) {
                const segId = `seg-${String(nextSegId()).padStart(3, "0")}`;
                segments.push({
                    id: segId,
                    scene_index: sceneIndex,
                    type: "narration",
                    chunks: chunkText(narText, narratorVoiceId, "Narrator", segId, nextChunkId),
                });
            }
        }
        // Dialogue
        const dialogueText = qm[1].trim();
        const speaker = lastNamedSpeaker || "Unknown";
        const voiceId = voices[speaker] || narratorVoiceId;
        if (voiceId !== narratorVoiceId) {
            voicesUsed[voiceId] = speaker;
        }
        const segId = `seg-${String(nextSegId()).padStart(3, "0")}`;
        segments.push({
            id: segId,
            scene_index: sceneIndex,
            type: "dialogue",
            speaker,
            chunks: chunkText(dialogueText, voiceId, speaker, segId, nextChunkId),
        });
        lastIndex = qStart + qm[0].length;
    }
    // Remaining narration
    const remaining = text.slice(lastIndex).trim();
    if (remaining) {
        const segId = `seg-${String(nextSegId()).padStart(3, "0")}`;
        segments.push({
            id: segId,
            scene_index: sceneIndex,
            type: "narration",
            chunks: chunkText(remaining, narratorVoiceId, "Narrator", segId, nextChunkId),
        });
    }
    return segments;
}
/**
 * Split text into chunks at sentence boundaries, max ~MAX_CHUNK_CHARS each.
 */
function chunkText(text, voiceId, voiceLabel, segmentId, nextId) {
    // Split on sentence-ending punctuation followed by space
    const sentences = text.match(/[^.!?]+[.!?]+[\s]*/g) || [text];
    const chunks = [];
    let buffer = "";
    for (const sentence of sentences) {
        if (buffer.length + sentence.length > MAX_CHUNK_CHARS && buffer.length > 0) {
            chunks.push(makeChunk(buffer.trim(), voiceId, voiceLabel, segmentId, nextId()));
            buffer = "";
        }
        buffer += sentence;
    }
    if (buffer.trim()) {
        chunks.push(makeChunk(buffer.trim(), voiceId, voiceLabel, segmentId, nextId()));
    }
    return chunks;
}
function makeChunk(text, voiceId, voiceLabel, segmentId, chunkNum) {
    return {
        id: `${segmentId}-chunk-${String(chunkNum).padStart(3, "0")}`,
        text,
        voice_id: voiceId,
        voice_label: voiceLabel,
        estimated_duration_ms: Math.round(text.length * MS_PER_CHAR),
    };
}
function normalizeSpeaker(raw) {
    // Capitalize first letter of each word, trim
    return raw
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}
//# sourceMappingURL=audiobook.js.map