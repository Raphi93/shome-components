import type React from "react";
import { useEffect, useMemo, useRef, useState, useImperativeHandle } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { idbDel, idbGet, idbSet } from "./idb";
import type {
  MessengerHandle,
  MessengerMessage,
  MessengerSettings,
  SettingField,
  MessengerProps,
} from "./types";

/* ----------------------- TTS Helpers ----------------------- */

function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  const list = window.speechSynthesis.getVoices();
  if (list.length) return Promise.resolve(list);
  return new Promise((resolve) => {
    const h = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", h);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", h, { once: true });
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1200);
  });
}

function pickVoice(voices: SpeechSynthesisVoice[], lang?: string, includes?: string[]) {
  const n = (s: string) => s.toLowerCase();
  let list = voices;
  if (lang) list = list.filter((v) => n(v.lang) === n(lang));
  if (includes?.length) {
    for (const hint of includes) {
      const hit = list.find((v) => n(v.name).includes(n(hint)) || n(v.voiceURI).includes(n(hint)));
      if (hit) return hit;
    }
  }
  return list[0] ?? null;
}

/** Entfernt Markdown/Sonderzeichen & normalisiert Satzzeichen-Abstände */
function sanitizeForTTS(s: string): string {
  if (!s) return "";
  let t = s;

  // Codeblöcke/Inline-Code
  t = t.replace(/```[\s\S]*?```/g, " ");
  t = t.replace(/`[^`]*`/g, " ");

  // Links [Text](url) → "Text"
  t = t.replace(/\[([^\]]+)\]\((?:https?:\/\/|mailto:)[^)]+\)/gi, "$1");

  // Markdown-Deko & störende Zeichen
  t = t.replace(/[*_~`>#]/g, "");            // * _ ~ ` # >
  t = t.replace(/[()\[\]{}<>]/g, " ");       // Klammern → Leerzeichen
  t = t.replace(/-{3,}/g, "—");              // --- → —
  t = t.replace(/\s*([,.;:!?…])\s*/g, "$1 "); // rund um Satzzeichen genau 1 Leerzeichen
  t = t.replace(/\s+/g, " ").trim();

  return t;
}

/** Zerlegt Text in gut sprechbare Chunks (erst Sätze, dann Kommas, zuletzt Spaces) */
function chunkText(src: string, maxLen = 220): string[] {
  const clean = sanitizeForTTS(src);
  if (!clean) return [];

  // harte Satzenden zuerst
  const raw = clean.split(/([.!?…]+)\s+/);
  const sentences: string[] = [];
  for (let i = 0; i < raw.length; i++) {
    const part = raw[i];
    if (!part) continue;
    const isPunct = /^[.!?…]+$/.test(part);
    if (isPunct && sentences.length) {
      sentences[sentences.length - 1] += part;
    } else {
      sentences.push(part);
    }
  }

  const out: string[] = [];
  const pushIfUseful = (s: string) => {
    const t = s.trim();
    if (!t || /^[,.;:!?…-]$/.test(t)) return; // keine "nur Satzzeichen"-Chunks
    out.push(t);
  };

  for (const s of sentences) {
    if (s.length <= maxLen) {
      pushIfUseful(s);
      continue;
    }
    // weich an Kommas teilen
    const commaParts = s.split(/,\s+/);
    let buf = "";
    for (let i = 0; i < commaParts.length; i++) {
      const piece = commaParts[i];
      const candidate = buf ? `${buf}, ${piece}` : piece;
      if (candidate.length <= maxLen) {
        buf = candidate;
      } else {
        if (buf) pushIfUseful(buf);
        // hart am Space umbrechen
        let rest = piece;
        while (rest.length > maxLen) {
          const cut = rest.lastIndexOf(" ", maxLen);
          const idx = cut > 40 ? cut : maxLen; // nicht mitten im Wort, außer nötig
          pushIfUseful(rest.slice(0, idx));
          rest = rest.slice(idx).trim();
        }
        buf = rest;
      }
    }
    if (buf) pushIfUseful(buf);
  }

  return out;
}

/* -------------------- Hook: useMessengerState -------------------- */

export function useMessengerState(props: MessengerProps, ref: React.Ref<MessengerHandle>) {
  const {
    onSend,
    isLoading = false,
    persist = false,
    isIndexDb = false,
    storageKey = "messenger",
    enableTTS = true,
    ttsDefaultOn = true,
    ttsLang = "de-DE",
    ttsVoiceIncludes = ["katja", "microsoft", "google"],
    enableSTT = true,
    sttLang = "de-DE",
    inputPlaceholder = "Send message...",
    initialMessages = [],
    settingsSchema = [],
    filters = [],
    renderMessage,
    childrenButtons,
    setUserInput,
    labelUser,
    labelSendButton,
    isLightColor,
    imageBackGroundStyle,
    image,
    setImage,
  } = props;

  const [messages, setMessages] = useState<MessengerMessage[]>([]);
  const [input, setInput] = useState("");
  // wichtig: default NICHT aufnehmen, sonst braucht man zwei Klicks
  const [recording, setRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [ttsMuted, setTtsMuted] = useState(!ttsDefaultOn);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<MessengerSettings>(() =>
    settingsSchema.reduce<MessengerSettings>((acc, f) => {
      if (f.type === "text" && f.defaultValue !== undefined) acc[f.id] = f.defaultValue;
      if (f.type === "number" && f.defaultValue !== undefined) acc[f.id] = f.defaultValue;
      if (f.type === "select" && f.defaultValue !== undefined) acc[f.id] = f.defaultValue;
      if (f.type === "checkbox" && f.defaultValue !== undefined) acc[f.id] = f.defaultValue;
      if (f.type === "radio" && f.defaultValue !== undefined) acc[f.id] = f.defaultValue;
      return acc;
    }, {})
  );
  const [filterState, setFilterState] = useState<Record<string, string | string[] | null>>(
    () => Object.fromEntries(filters.map((f) => [f.id, f.multiple ? [] : null]))
  );

  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const endRef = useRef<HTMLDivElement>(null);

  const [hydrated, setHydrated] = useState(false);
  const [micPrimed, setMicPrimed] = useState(false); // Permission-Warmup-Flag

  /* ---- TTS engine state ---- */
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const ttsQueueRef = useRef<string[]>([]);
  const speakingRef = useRef(false);
  const cachedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const cancelTTS = () => {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    currentUtteranceRef.current = null;
    speakingRef.current = false;
    ttsQueueRef.current = [];
  };

  async function ensureVoice(): Promise<SpeechSynthesisVoice | null> {
    if (cachedVoiceRef.current) return cachedVoiceRef.current;
    const voices = await waitForVoices();
    const v = pickVoice(voices, ttsLang, ttsVoiceIncludes) ?? null;
    cachedVoiceRef.current = v;
    return v;
  }

  function playNextChunk(delayMs = 80) {
    if (speakingRef.current) return;
    const next = ttsQueueRef.current.shift();
    if (!next) return;

    setTimeout(async () => {
      const u = new SpeechSynthesisUtterance(next);
      currentUtteranceRef.current = u;
      speakingRef.current = true;

      const v = await ensureVoice();
      if (v) u.voice = v;
      u.pitch = 1;
      u.rate = 0.95;
      u.volume = 1;

      u.onend = () => {
        speakingRef.current = false;
        currentUtteranceRef.current = null;
        playNextChunk();
      };
      u.onerror = () => {
        speakingRef.current = false;
        currentUtteranceRef.current = null;
        playNextChunk();
      };

      try {
        window.speechSynthesis.speak(u);
      } catch {
        speakingRef.current = false;
        currentUtteranceRef.current = null;
      }
    }, delayMs);
  }

  // einmaliger Gesture-Hook: TTS abbrechen + Mic-Permission „vorwärmen“
  useEffect(() => {
    const primeOnce = async () => {
      cancelTTS();
      try {
        if (!micPrimed && navigator.mediaDevices?.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          setMicPrimed(true);
        }
      } catch {
        // Permission bleibt Sache des Browsers
      }
      window.removeEventListener("pointerdown", primeOnce);
    };
    window.addEventListener("pointerdown", primeOnce, { once: true });
    return () => window.removeEventListener("pointerdown", primeOnce);
  }, [micPrimed]);

  // Persistenz laden
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isIndexDb) {
          const ms = await idbGet<MessengerMessage[]>(`${storageKey}:messages`);
          const st = await idbGet<MessengerSettings>(`${storageKey}:settings`);
          const mt = await idbGet<boolean>(`${storageKey}:ttsMuted`);
          const fs = await idbGet<Record<string, string | string[] | null>>(`${storageKey}:filters`);
          if (cancelled) return;
          setMessages(ms ?? initialMessages);
          if (st) setSettings(st);
          if (typeof mt === "boolean") setTtsMuted(mt);
          if (fs) setFilterState(fs);
        } else if (persist) {
          const ms = localStorage.getItem(`${storageKey}:messages`);
          const st = localStorage.getItem(`${storageKey}:settings`);
          const mt = localStorage.getItem(`${storageKey}:ttsMuted`);
          const fs = localStorage.getItem(`${storageKey}:filters`);
          if (cancelled) return;
          setMessages(ms ? JSON.parse(ms) : initialMessages);
          if (st) setSettings(JSON.parse(st));
          if (mt) setTtsMuted(JSON.parse(mt));
          if (fs) setFilterState(JSON.parse(fs));
        } else {
          if (cancelled) return;
          setMessages(initialMessages);
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isIndexDb, persist, storageKey, initialMessages]);

  // Persistenz speichern
  useEffect(() => {
    if (!hydrated) return;
    (async () => {
      try {
        if (isIndexDb) {
          await idbSet(`${storageKey}:messages`, messages);
          await idbSet(`${storageKey}:settings`, settings);
          await idbSet(`${storageKey}:ttsMuted`, ttsMuted);
          await idbSet(`${storageKey}:filters`, filterState);
        } else if (persist) {
          localStorage.setItem(`${storageKey}:messages`, JSON.stringify(messages));
          localStorage.setItem(`${storageKey}:settings`, JSON.stringify(settings));
          localStorage.setItem(`${storageKey}:ttsMuted`, JSON.stringify(ttsMuted));
          localStorage.setItem(`${storageKey}:filters`, JSON.stringify(filterState));
        }
      } catch {}
    })();
  }, [isIndexDb, persist, hydrated, storageKey, messages, settings, ttsMuted, filterState]);

  // STT → Input übernehmen, wenn Aufnahme unerwartet endet
  useEffect(() => {
    if (!listening && recording) {
      setRecording(false);
      setInput(transcript);
      resetTranscript();
    }
  }, [listening, recording, transcript, resetTranscript]);

  // Autoscroll
  useEffect(() => {
    if (messages[messages.length - 1]?.content !== '...') {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // TTS stummschalten
  useEffect(() => {
    if (ttsMuted) cancelTTS();
  }, [ttsMuted]);

  // Cleanup
  useEffect(() => () => cancelTTS(), []);

  // optional: bei jedem Pointerdown TTS abbrechen (vermeidet „erster Klick stoppt nur TTS“)
  useEffect(() => {
    const killTTS = () => cancelTTS();
    window.addEventListener("pointerdown", killTTS);
    return () => window.removeEventListener("pointerdown", killTTS);
  }, []);

  const lastSetUserInputKey = useRef<string | number | undefined>(undefined);
  useEffect(() => {
    if (!setUserInput) return;
    const key = setUserInput.id ?? setUserInput.createdAt;
    if (key && key === lastSetUserInputKey.current) return;
    setInput(setUserInput.content ?? "");
    lastSetUserInputKey.current = key;
  }, [setUserInput]);

  // Hilfsfunktion: robuste ID eines Messages (fällt auf createdAt zurück)
  const msgKey = (m: MessengerMessage) => m.id ?? String(m.createdAt);

  useImperativeHandle(ref, () => ({
    addMessages: (msgs) => {
      setMessages((prev) => {
        const next = [...prev, ...msgs];
        const speakable = msgs.find((m) => m.type === "bot" && m.content?.trim().length);
        if (speakable && enableTTS && !ttsMuted) speakText(speakable.content!);
        return next;
      });
    },
    clear: () => {
      setMessages([]);
      if (isIndexDb) {
        void idbDel(`${storageKey}:messages`);
      } else if (persist) {
        localStorage.removeItem(`${storageKey}:messages`);
      }
    },
    getSettings: () => settings,
    speakLast: () => {
      const last = [...messages].reverse().find((m) => m.type === "bot" && m.content);
      if (last && enableTTS && !ttsMuted) speakText(last.content!);
    },
    setSetting: (id, value) => setSettings((s) => ({ ...s, [id]: value })),

    // Nachricht per id PATCHEN (oder upserten, falls nicht vorhanden)
    updateMessage: (id: string, patch: Partial<MessengerMessage>) => {
      if (!id) return;
      setMessages((prev) => {
        let found = false;
        const next = prev.map((m) => {
          if (msgKey(m) === id) {
            found = true;
            return { ...m, ...patch, id: m.id ?? id };
          }
          return m;
        });
        if (!found) {
          next.push({
            id,
            type: patch.type ?? "bot",
            content: patch.content,
            image: patch.image,
            createdAt: Date.now(),
          } as MessengerMessage);
        }
        // TTS auslösen, wenn bot-Content neu kam
        if (!ttsMuted && enableTTS && typeof patch.content === "string" && patch.content.trim()) {
          try { speakText(patch.content); } catch {}
        }
        return next;
      });
    },

    // Nachricht per id entfernen
    removeMessage: (id: string) => {
      if (!id) return;
      setMessages((prev) => prev.filter((m) => msgKey(m) !== id));
    },
  }));

  async function handleSend() {
    const u: MessengerMessage = { type: "user", content: input, createdAt: Date.now(), image: image ? [image] : null };
    setMessages((p) => [...p, u]);
    const txt = input;
    setInput("");
    setShowSettings(false);
    await onSend({ text: txt, isImage, settings });
  }

  async function toggleRecord() {
    if (!enableSTT) return;

    // Beim Start: immer TTS stoppen, damit EIN Klick sofort STT beginnt
    if (!recording) {
      cancelTTS();

      // Mic ggf. „primen“ (nach erstem User-Gesture klappt das ohne Prompt)
      try {
        if (!micPrimed && navigator.mediaDevices?.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          setMicPrimed(true);
        }
      } catch {
        // ignore
      }

      setRecording(true);
      resetTranscript();

      try {
        // Guard gegen fehlende Browser-Unterstützung
        // @ts-ignore - lib stellt es bereit
        if (typeof SpeechRecognition?.browserSupportsSpeechRecognition === "function") {
          // @ts-ignore
          const ok = SpeechRecognition.browserSupportsSpeechRecognition();
          if (!ok) throw new Error("SpeechRecognition not supported");
        }
        await SpeechRecognition.startListening({ continuous: true, language: sttLang });
      } catch {
        setRecording(false);
      }
    } else {
      setRecording(false);
      try {
        SpeechRecognition.stopListening();
      } catch {}
      setInput((prev) => prev + transcript);
    }
  }

  async function speakText(text: string) {
    if (!enableTTS || ttsMuted) return;
    const msg = sanitizeForTTS(text);
    if (!msg) return;

    cancelTTS(); 
    ttsQueueRef.current = chunkText(msg, 220);
    if (ttsQueueRef.current.length === 0) return; // nichts Sinnvolles zu sagen
    playNextChunk(60);
  }

  async function deleteHistoryAll() {
    if (isIndexDb) {
      await idbDel(`${storageKey}:messages`);
      await idbDel(`${storageKey}:settings`);
      await idbDel(`${storageKey}:ttsMuted`);
      await idbDel(`${storageKey}:filters`);
    } else if (persist) {
      localStorage.removeItem(`${storageKey}:messages`);
      localStorage.removeItem(`${storageKey}:settings`);
      localStorage.removeItem(`${storageKey}:ttsMuted`);
      localStorage.removeItem(`${storageKey}:filters`);
    }
    setMessages([]);
  }

  function applyFilters(list: MessengerMessage[]) {
    return list.filter((m) =>
      filters.every((f) => {
        const sel = filterState[f.id];
        if (f.multiple) {
          const arr = Array.isArray(sel) ? sel : [];
          if (arr.length === 0) return true;
          return arr.every((v) => f.predicate(m, v));
        } else {
          if (!sel) return true;
          return f.predicate(m, sel as string);
        }
      })
    );
  }

  const visibleMessages = useMemo(() => applyFilters(messages), [messages, filterState, filters]);

  const getTextValue = (f: SettingField) => String(settings[f.id] ?? "");
  const getNumberValue = (f: SettingField) => Number(settings[f.id] ?? (f as any).defaultValue ?? 0);
  const getBooleanValue = (f: SettingField) => Boolean(settings[f.id] ?? (f as any).defaultValue ?? false);

  return {
    messages,
    visibleMessages,
    input,
    setInput,
    endRef,
    fullscreenImage,
    setFullscreenImage,
    recording,
    showSettings,
    setShowSettings,
    isImage,
    setIsImage,
    ttsMuted,
    setTtsMuted,
    inputPlaceholder,
    isLoading,
    enableSTT,
    enableTTS,
    renderMessage,
    handleSend,
    toggleRecord,
    speakText,
    deleteHistoryAll,
    settingsSchema,
    settings,
    setSettings,
    getTextValue,
    getNumberValue,
    getBooleanValue,
    ttsDefaultOn,
    ttsLang,
    sttLang,
    childrenButtons,
    labelUser,
    labelSendButton,
    isLightColor,
    imageBackGroundStyle,
        image,
    setImage,
  };
}
