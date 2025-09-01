import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faImage, faMicrophone, faRepeat, faSave, faSpinner, faStop, faVolumeHigh, faVolumeMute, faFilter } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import { NumberInput, Select, type SelectOption } from "../index";
import { StringInput } from "../index";
import "./Messenger.css";

export type MessengerMessage = {
    id?: string;
    type: "user" | "bot";
    content?: string;
    image?: string | null;
    createdAt?: number;
    [key: string]: unknown;
};

export type SettingOption = SelectOption;

export type SettingField =
    | { id: string; label: string; type: "text"; defaultValue?: string }
    | { id: string; label: string; type: "number"; min?: number; max?: number; step?: number; defaultValue?: number }
    | { id: string; label: string; type: "select"; options: SettingOption[]; defaultValue?: string }
    | { id: string; label: string; type: "boolean"; defaultValue?: boolean };

export type FilterSpec = {
    id: string;
    label: string;
    options: SelectOption[];
    multiple?: boolean;
    predicate: (msg: MessengerMessage, value: string) => boolean;
};

export type MessengerSettings = Record<string, string | number | boolean>;

export type MessengerHandle = {
    addMessages: (msgs: MessengerMessage[]) => void;
    clear: () => void;
    getSettings: () => MessengerSettings;
    speakLast: () => void;
    setSetting: (id: string, value: string | number | boolean) => void;
};

type Props = {
    onSend: (args: { text: string; isImage: boolean; settings: MessengerSettings }) => Promise<void> | void;
    isLoading?: boolean;
    persist?: boolean;
    storageKey?: string;
    enableTTS?: boolean;
    ttsDefaultOn?: boolean;
    ttsLang?: string;
    ttsVoiceIncludes?: string[];
    enableSTT?: boolean;
    sttLang?: string;
    inputPlaceholder?: string;
    initialMessages?: MessengerMessage[];
    settingsSchema?: SettingField[];
    filters?: FilterSpec[];
    LabelDeleteHistory: string;
    renderMessage?: (m: MessengerMessage) => React.ReactNode;
};

export const Messenger = forwardRef<MessengerHandle, Props>(function Messenger(
    {
        onSend,
        isLoading = false,
        persist = false,
        storageKey = "messenger",
        enableTTS = true,
        ttsDefaultOn = true,
        ttsLang = "de-DE",
        ttsVoiceIncludes = ["katja", "microsoft", "google"],
        enableSTT = true,
        sttLang = "de-DE",
        inputPlaceholder = "Nachricht eingeben…",
        initialMessages = [],
        settingsSchema = [],
        filters = [],
        renderMessage,
        LabelDeleteHistory
    },
    ref
) {
    const [messages, setMessages] = useState<MessengerMessage[]>([]);
    const [input, setInput] = useState("");
    const [recording, setRecording] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const [ttsMuted, setTtsMuted] = useState(!ttsDefaultOn);
    const [settings, setSettings] = useState<MessengerSettings>(() =>
        settingsSchema.reduce<MessengerSettings>((acc, f) => {
            if (f.type === "text" && f.defaultValue !== undefined) acc[f.id] = f.defaultValue;
            if (f.type === "number" && f.defaultValue !== undefined) acc[f.id] = f.defaultValue;
            if (f.type === "select" && f.defaultValue !== undefined) acc[f.id] = f.defaultValue;
            if (f.type === "boolean" && f.defaultValue !== undefined) acc[f.id] = f.defaultValue;
            return acc;
        }, {})
    );
    const { transcript, listening, resetTranscript } = useSpeechRecognition();
    const endRef = useRef<HTMLDivElement>(null);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [filterState, setFilterState] = useState<Record<string, string | string[] | null>>(() =>
        Object.fromEntries(filters.map(f => [f.id, f.multiple ? [] : null]))
    );

    useEffect(() => {
        if (!persist) {
            setMessages(initialMessages);
            return;
        }
        const ms = localStorage.getItem(`${storageKey}:messages`);
        const st = localStorage.getItem(`${storageKey}:settings`);
        const mt = localStorage.getItem(`${storageKey}:ttsMuted`);
        const fs = localStorage.getItem(`${storageKey}:filters`);
        setMessages(ms ? JSON.parse(ms) : initialMessages);
        if (st) setSettings(JSON.parse(st));
        if (mt) setTtsMuted(JSON.parse(mt));
        if (fs) setFilterState(JSON.parse(fs));
    }, [persist, storageKey, initialMessages]);

    useEffect(() => {
        if (!persist) return;
        localStorage.setItem(`${storageKey}:messages`, JSON.stringify(messages));
    }, [messages, persist, storageKey]);

    useEffect(() => {
        if (!persist) return;
        localStorage.setItem(`${storageKey}:settings`, JSON.stringify(settings));
    }, [settings, persist, storageKey]);

    useEffect(() => {
        if (!persist) return;
        localStorage.setItem(`${storageKey}:ttsMuted`, JSON.stringify(ttsMuted));
    }, [ttsMuted, persist, storageKey]);

    useEffect(() => {
        if (!persist) return;
        localStorage.setItem(`${storageKey}:filters`, JSON.stringify(filterState));
    }, [filterState, persist, storageKey]);

    useEffect(() => {
        if (!listening && recording) {
            setRecording(false);
            setInput(transcript);
            resetTranscript();
        }
    }, [listening]);

    useEffect(() => {
        if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useImperativeHandle(ref, () => ({
        addMessages: (msgs) => {
            setMessages((p) => {
                const next = [...p, ...msgs];
                const speakable = msgs.find((m) => m.type === "bot" && m.content && m.content.trim().length > 0);
                if (speakable && enableTTS && !ttsMuted) speakText(speakable.content!);
                return next;
            });
        },
        clear: () => {
            setMessages([]);
            if (persist) localStorage.removeItem(`${storageKey}:messages`);
        },
        getSettings: () => settings,
        speakLast: () => {
            const last = [...messages].reverse().find((m) => m.type === "bot" && m.content);
            if (last && enableTTS && !ttsMuted) speakText(last.content!);
        },
        setSetting: (id, value) => setSettings((s) => ({ ...s, [id]: value })),
    }));

    const handleSend = async () => {
        if (!input.trim()) return;
        const u: MessengerMessage = { type: "user", content: input };
        setMessages((p) => [...p, u]);
        const txt = input;
        setInput("");
        setShowSettings(false);
        await onSend({ text: txt, isImage, settings });
    };

    const toggleRecord = () => {
        if (!enableSTT) return;
        if (!recording) {
            setRecording(true);
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true, language: sttLang });
        } else {
            setRecording(false);
            SpeechRecognition.stopListening();
            setInput((prev) => prev + transcript);
        }
    };

    const speakText = (text: string) => {
        if (!enableTTS || ttsMuted) return;
        const u = new SpeechSynthesisUtterance(text);
        const load = () => {
            const vs = window.speechSynthesis.getVoices();
            const first = vs.find((v) => v.lang === ttsLang && ttsVoiceIncludes.some((k) => v.name.toLowerCase().includes(k.toLowerCase())));
            if (first) u.voice = first;
            u.pitch = 1;
            u.rate = 0.95;
            u.volume = 1;
            window.speechSynthesis.speak(u);
        };
        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.addEventListener("voiceschanged", load, { once: true });
        } else load();
    };

    const applyFilters = (list: MessengerMessage[]) => {
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
    };

    const visibleMessages = applyFilters(messages);

    return (
        <div className="chat-container">
            {filters.length > 0 && (
                <div className="image-settings-container" style={{ marginBottom: "0.5rem" }}>
                    {filters.map((f) => (
                        <div key={f.id} className="image-settings">
                            <label>{f.label}</label>
                            <div style={{ minWidth: 220 }}>
                                <Select
                                    options={f.options}
                                    value={filterState[f.id] ?? (f.multiple ? [] : null)}
                                    multiple={!!f.multiple}
                                    onChange={(val: any) => setFilterState((s) => ({ ...s, [f.id]: val }))}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="messages">
                {visibleMessages.map((m, i) => (
                    <div key={m.id ?? i} className={`message ${m.type}`}>
                        {renderMessage ? (
                            renderMessage(m)
                        ) : m.image ? (
                            <img src={`data:image/png;base64,${m.image}`} alt="img" className="message-image" onClick={() => setFullscreenImage(m.image ?? null)} style={{ cursor: "pointer" }} />
                        ) : (
                            <div className="message-bubble">{m.content}</div>
                        )}
                    </div>
                ))}
                <div ref={endRef} />
                {fullscreenImage && (
                    <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
                        <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-button" onClick={() => setFullscreenImage(null)}>✖</button>
                            <img src={`data:image/png;base64,${fullscreenImage}`} alt="full" className="fullscreen-image" />
                        </div>
                    </div>
                )}
            </div>

            {showSettings && settingsSchema.length > 0 && (
                <div className="image-settings-container">
                    <div className="image-settings">
                        <label>History</label>
                        <Button color="danger" text="Delete" onClick={() => { setMessages([]); if (persist) localStorage.removeItem(`${storageKey}:messages`); }} />
                    </div>
                    {settingsSchema.map((f) => (
                        <div key={f.id} className="image-settings">
                            <label>{f.label}</label>
                            {f.type === "text" && (
                                <div style={{ minWidth: 220 }}>
                                    <StringInput label={f.label} value={String(settings[f.id] ?? "")} onChange={(v: string) => setSettings((s) => ({ ...s, [f.id]: v }))} />
                                </div>
                            )}
                            {f.type === "number" && (
                                <NumberInput
                                    label={f.label}
                                    value={Number(settings[f.id] ?? f.defaultValue ?? 0)}
                                    onChange={(value: number | null) => {
                                        setSettings((s) => ({ ...s, [f.id]: value === null ? 0 : value }));
                                    }}
                                    min={(f as any).min}
                                    max={(f as any).max}
                                    step={(f as any).step}
                                />
                            )}
                            {f.type === "select" && (
                                <div style={{ minWidth: 220 }}>
                                    <Select options={(f as any).options} value={(settings[f.id] as string) ?? null} onChange={(v) => setSettings((s) => ({ ...s, [f.id]: v as string }))} />
                                </div>
                            )}
                            {f.type === "boolean" && (
                                <input type="checkbox" checked={Boolean(settings[f.id] ?? f.defaultValue ?? false)} onChange={(e) => setSettings((s) => ({ ...s, [f.id]: e.target.checked }))} />
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="input-area">
                <div className="input-function">
                    <Button icon={faImage} color="secondary" onClick={() => { setIsImage((v) => !v); if (!isImage) setInput("Erstelle ein Bild: "); }} />
                    <Button icon={recording ? faStop : faMicrophone} color="secondary" onClick={toggleRecord} disabled={isLoading || !enableSTT} />
                    {enableTTS && <Button icon={ttsMuted ? faVolumeMute : faVolumeHigh} color="secondary" onClick={() => setTtsMuted((v) => !v)} />}
                    <Button icon={faRepeat} color="secondary" onClick={() => { const last = [...messages].reverse().find((m) => m.type === "bot" && m.content); if (last && enableTTS && !ttsMuted) speakText(last.content!); }} />
                </div>
                <div className="input-chat-mode">
                    <Button icon={faGear} color="secondary" onClick={() => setShowSettings((v) => !v)} />
                    <textarea className="text-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={inputPlaceholder} />
                    <Button icon={isLoading ? faSpinner : faSave} color="primary" onClick={handleSend} disabled={isLoading} />
                </div>
            </div>
        </div>
    );
});