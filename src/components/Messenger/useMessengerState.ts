import { useEffect, useMemo, useRef, useState, useImperativeHandle, use } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { idbDel, idbGet, idbSet } from "./idb";
import type {
    MessengerHandle, MessengerMessage, MessengerSettings, SettingField, FilterSpec, MessengerProps
} from "./types";

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
        ttsVoiceIncludes = ["Katja (Natural)", "microsoft", "google"],
        enableSTT = true,
        sttLang = "de-DE",
        inputPlaceholder = "Send message...",
        initialMessages = [],
        settingsSchema = [],
        filters = [],
        renderMessage,
        labelUser,
        labelSendButton = "Send",
        childrenButtons,
        setUserInput
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
        () => Object.fromEntries(filters.map(f => [f.id, f.multiple ? [] : null]))
    );

    const { transcript, listening, resetTranscript } = useSpeechRecognition();
    const endRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (isIndexDb) {
                try {
                    const ms = await idbGet<MessengerMessage[]>(`${storageKey}:messages`);
                    const st = await idbGet<MessengerSettings>(`${storageKey}:settings`);
                    const mt = await idbGet<boolean>(`${storageKey}:ttsMuted`);
                    const fs = await idbGet<Record<string, string | string[] | null>>(`${storageKey}:filters`);
                    if (!cancelled) {
                        setMessages(ms ?? initialMessages);
                        if (st) setSettings(st);
                        if (typeof mt === "boolean") setTtsMuted(mt);
                        if (fs) setFilterState(fs);
                    }
                    return;
                } catch {
                    if (!cancelled) setMessages(initialMessages);
                    return;
                }
            }
            if (!persist) {
                if (!cancelled) setMessages(initialMessages);
                return;
            }
            const ms = localStorage.getItem(`${storageKey}:messages`);
            const st = localStorage.getItem(`${storageKey}:settings`);
            const mt = localStorage.getItem(`${storageKey}:ttsMuted`);
            const fs = localStorage.getItem(`${storageKey}:filters`);
            if (!cancelled) {
                setMessages(ms ? JSON.parse(ms) : initialMessages);
                if (st) setSettings(JSON.parse(st));
                if (mt) setTtsMuted(JSON.parse(mt));
                if (fs) setFilterState(JSON.parse(fs));
            }
        })();
        return () => { cancelled = true; };
    }, [isIndexDb, persist, storageKey, initialMessages]);

    // Persist: IDB
    useEffect(() => {
        if (!isIndexDb) return;
        (async () => {
            try {
                await idbSet(`${storageKey}:messages`, messages);
                await idbSet(`${storageKey}:settings`, settings);
                await idbSet(`${storageKey}:ttsMuted`, ttsMuted);
                await idbSet(`${storageKey}:filters`, filterState);
            } catch { /* noop */ }
        })();
    }, [isIndexDb, storageKey, messages, settings, ttsMuted, filterState]);

    // Persist: localStorage
    useEffect(() => {
        if (isIndexDb || !persist) return;
        localStorage.setItem(`${storageKey}:messages`, JSON.stringify(messages));
        localStorage.setItem(`${storageKey}:settings`, JSON.stringify(settings));
        localStorage.setItem(`${storageKey}:ttsMuted`, JSON.stringify(ttsMuted));
        localStorage.setItem(`${storageKey}:filters`, JSON.stringify(filterState));
    }, [isIndexDb, persist, storageKey, messages, settings, ttsMuted, filterState]);

    // STT lifecycle
    useEffect(() => {
        if (!listening && recording) {
            setRecording(false);
            setInput(transcript);
            resetTranscript();
        }
    }, [listening, recording, transcript, resetTranscript]);

    // autoscroll
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Imperative API
    useImperativeHandle(ref, () => ({
        addMessages: (msgs) => {
            setMessages(prev => {
                const next = [...prev, ...msgs];
                const speakable = msgs.find(m => m.type === "bot" && m.content?.trim().length);
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
            const last = [...messages].reverse().find(m => m.type === "bot" && m.content);
            if (last && enableTTS && !ttsMuted) speakText(last.content!);
        },
        setSetting: (id, value) => setSettings(s => ({ ...s, [id]: value })),
    }));

    // Actions
    async function handleSend() {
        if (!input.trim()) return;
        const u: MessengerMessage = { type: "user", content: input, createdAt: Date.now() };
        setMessages(p => [...p, u]);
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
            SpeechRecognition.startListening({ continuous: true, language: sttLang });
        } else {
            setRecording(false);
            SpeechRecognition.stopListening();
            setInput(prev => prev + transcript);
        }
    }

    function speakText(text: string) {
        if (!enableTTS || ttsMuted) return;
        const u = new SpeechSynthesisUtterance(text);
        const load = () => {
            const vs = window.speechSynthesis.getVoices();
            const first = vs.find(v => v.lang === ttsLang && ttsVoiceIncludes.some(k => v.name.toLowerCase().includes(k.toLowerCase())));
            if (first) u.voice = first;
            u.pitch = 1; u.rate = 0.95; u.volume = 1;
            window.speechSynthesis.speak(u);
        };
        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.addEventListener("voiceschanged", load, { once: true });
        } else load();
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

    // Filters
    function applyFilters(list: MessengerMessage[]) {
        return list.filter(m =>
            filters.every(f => {
                const sel = filterState[f.id];
                if (f.multiple) {
                    const arr = Array.isArray(sel) ? sel : [];
                    if (arr.length === 0) return true;
                    return arr.every(v => f.predicate(m, v));
                } else {
                    if (!sel) return true;
                    return f.predicate(m, sel as string);
                }
            })
        );
    }
    const visibleMessages = useMemo(() => applyFilters(messages), [messages, filterState, filters]);

    // Settings field helpers
    const getTextValue = (f: SettingField) => String(settings[f.id] ?? "");
    const getNumberValue = (f: SettingField) => Number(settings[f.id] ?? (f as any).defaultValue ?? 0);
    const getBooleanValue = (f: SettingField) => Boolean(settings[f.id] ?? (f as any).defaultValue ?? false);

    useEffect(() => {
        if (setUserInput) {
             setInput(setUserInput.content ?? "");
        }
    }, [input, setUserInput]);

    return {
        // state
        messages, visibleMessages, input, setInput, endRef, fullscreenImage, setFullscreenImage,
        recording, showSettings, setShowSettings, isImage, setIsImage,
        ttsMuted, setTtsMuted, inputPlaceholder, isLoading, enableSTT, enableTTS,
        // config
        renderMessage,
        // actions
        handleSend, toggleRecord, speakText, deleteHistoryAll,
        // settings API
        settingsSchema, settings, setSettings,
        getTextValue, getNumberValue, getBooleanValue,
        // props passthrough
        ...{ ttsDefaultOn, ttsLang, sttLang },
        labelUser,
        labelSendButton,
        childrenButtons
    };
}
