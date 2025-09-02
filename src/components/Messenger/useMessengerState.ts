import type React from "react";
import { useEffect, useMemo, useRef, useState, useImperativeHandle } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { idbDel, idbGet, idbSet } from "./idb";
import type { MessengerHandle, MessengerMessage, MessengerSettings, SettingField, MessengerProps } from "./types";

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
  return list[0];
}

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
  } = props;

  const [messages, setMessages] = useState<MessengerMessage[]>([]);
  const [input, setInput] = useState("");
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

  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const cancelTTS = () => {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    currentUtteranceRef.current = null;
  };

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

  useEffect(() => {
    if (!isIndexDb || !hydrated) return;
    (async () => {
      try {
        await idbSet(`${storageKey}:messages`, messages);
        await idbSet(`${storageKey}:settings`, settings);
        await idbSet(`${storageKey}:ttsMuted`, ttsMuted);
        await idbSet(`${storageKey}:filters`, filterState);
      } catch {}
    })();
  }, [isIndexDb, hydrated, storageKey, messages, settings, ttsMuted, filterState]);

  useEffect(() => {
    if (isIndexDb || !persist || !hydrated) return;
    localStorage.setItem(`${storageKey}:messages`, JSON.stringify(messages));
    localStorage.setItem(`${storageKey}:settings`, JSON.stringify(settings));
    localStorage.setItem(`${storageKey}:ttsMuted`, JSON.stringify(ttsMuted));
    localStorage.setItem(`${storageKey}:filters`, JSON.stringify(filterState));
  }, [isIndexDb, persist, hydrated, storageKey, messages, settings, ttsMuted, filterState]);

  useEffect(() => {
    if (!listening && recording) {
      setRecording(false);
      setInput(transcript);
      resetTranscript();
    }
  }, [listening, recording, transcript, resetTranscript]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (ttsMuted) cancelTTS();
  }, [ttsMuted]);

  useEffect(() => () => cancelTTS(), []);

  const lastSetUserInputKey = useRef<string | number | undefined>(undefined);
  useEffect(() => {
    if (!setUserInput) return;
    const key = setUserInput.id ?? setUserInput.createdAt;
    if (key && key === lastSetUserInputKey.current) return;
    setInput(setUserInput.content ?? "");
    lastSetUserInputKey.current = key;
  }, [setUserInput]);

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
  }));

  async function handleSend() {
    if (!input.trim()) return;
    const u: MessengerMessage = { type: "user", content: input, createdAt: Date.now() };
    setMessages((p) => [...p, u]);
    const txt = input;
    setInput("");
    setShowSettings(false);
    await onSend({ text: txt, isImage, settings });
  }

  function toggleRecord() {
    if (!enableSTT) return;
    if (!recording) {
      setRecording(true);
      resetTranscript();
      try {
        SpeechRecognition.startListening({ continuous: true, language: sttLang });
      } catch {
        setRecording(false);
      }
    } else {
      setRecording(false);
      SpeechRecognition.stopListening();
      setInput((prev) => prev + transcript);
    }
  }

  async function speakText(text: string) {
    if (!enableTTS || ttsMuted) return;
    const msg = text?.trim();
    if (!msg) return;

    cancelTTS();

    const u = new SpeechSynthesisUtterance(msg);
    currentUtteranceRef.current = u;

    const voices = await waitForVoices();
    const v = pickVoice(voices, ttsLang, ttsVoiceIncludes);
    if (v) u.voice = v;

    u.pitch = 1;
    u.rate = 0.95;
    u.volume = 1;

    u.onend = () => {
      if (currentUtteranceRef.current === u) currentUtteranceRef.current = null;
    };
    u.onerror = () => {
      if (currentUtteranceRef.current === u) currentUtteranceRef.current = null;
    };

    try {
      window.speechSynthesis.speak(u);
    } catch {}
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
  };
}
