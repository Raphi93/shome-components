import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faImage, faMicrophone, faRepeat, faSave, faSpinner, faStop, faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import "./Messenger.css";

export type MessengerMessage = {
  id?: string;
  type: "user" | "bot";
  content?: string;
  image?: string | null;
  createdAt?: number;
  [key: string]: unknown;
};

export type MessengerSettings = {
  height: number;
  width: number;
  steps: number;
  guidance: number;
  modelImage: string;
  mode: "hope" | "hope_latina";
};

export type MessengerHandle = {
  addMessages: (msgs: MessengerMessage[]) => void;
  clear: () => void;
  getSettings: () => MessengerSettings;
  speakLast: () => void;
};

type Props = {
  onSend: (args: { text: string; isImage: boolean; settings: MessengerSettings }) => Promise<void> | void;
  isLoading?: boolean;
  persist?: boolean;
  storageKey?: string;
  enableTTS?: boolean;
  ttsDefaultOn?: boolean;
  defaultSettings?: Partial<MessengerSettings>;
};

const base: MessengerSettings = {
  height: 400,
  width: 400,
  steps: 50,
  guidance: 8,
  modelImage: "anime",
  mode: "hope",
};

export const Messenger = forwardRef<MessengerHandle, Props>(function Messenger(
  { onSend, isLoading = false, persist = false, storageKey = "messenger", enableTTS = true, ttsDefaultOn = true, defaultSettings = {} },
  ref
) {
  const [messages, setMessages] = useState<MessengerMessage[]>([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [ttsMuted, setTtsMuted] = useState(!ttsDefaultOn);
  const [settings, setSettings] = useState<MessengerSettings>({ ...base, ...defaultSettings });
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const endRef = useRef<HTMLDivElement>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    if (!persist) return;
    const ms = localStorage.getItem(`${storageKey}:messages`);
    const st = localStorage.getItem(`${storageKey}:settings`);
    const mt = localStorage.getItem(`${storageKey}:ttsMuted`);
    if (ms) setMessages(JSON.parse(ms));
    if (st) setSettings(JSON.parse(st));
    if (mt) setTtsMuted(JSON.parse(mt));
  }, [persist, storageKey]);

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
    if (!recording) {
      setRecording(true);
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "de-DE" });
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
      const katja = vs.find((v) => v.lang === "de-DE" && v.name.toLowerCase().includes("katja"));
      const fb = vs.find((v) => v.lang === "de-DE" && (v.name.toLowerCase().includes("microsoft") || v.name.toLowerCase().includes("google")));
      if (katja) u.voice = katja; else if (fb) u.voice = fb;
      u.pitch = 1;
      u.rate = 0.95;
      u.volume = 1;
      window.speechSynthesis.speak(u);
    };
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", load, { once: true });
    } else load();
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.type}`}>
            {m.image ? (
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

      {showSettings && (
        <div className="image-settings-container">
          <div className="image-settings">
            <label>Verlauf</label>
            <button onClick={() => { setMessages([]); if (persist) localStorage.removeItem(`${storageKey}:messages`); }}>Löschen</button>
          </div>
          <div className="image-settings"><label>Höhe</label><input type="number" value={settings.height} onChange={(e) => setSettings({ ...settings, height: Number(e.target.value) })} /></div>
          <div className="image-settings"><label>Breite</label><input type="number" value={settings.width} onChange={(e) => setSettings({ ...settings, width: Number(e.target.value) })} /></div>
          <div className="image-settings"><label>Steps</label><input type="number" value={settings.steps} onChange={(e) => setSettings({ ...settings, steps: Number(e.target.value) })} /></div>
          <div className="image-settings"><label>Guidance</label><input type="number" value={settings.guidance} onChange={(e) => setSettings({ ...settings, guidance: Number(e.target.value) })} /></div>
          <div className="image-settings">
            <label>Bild</label>
            <select value={settings.modelImage} onChange={(e) => setSettings({ ...settings, modelImage: e.target.value as MessengerSettings["modelImage"] })}>
              <option value="real">Real</option>
              <option value="real-2">Real-2</option>
              <option value="anime">Anime</option>
              <option value="anime-2">Anime-2</option>
            </select>
          </div>
          <div className="image-settings">
            <label>Modus</label>
            <select value={settings.mode} onChange={(e) => setSettings({ ...settings, mode: e.target.value as MessengerSettings["mode"] })}>
              <option value="hope">Hope</option>
              <option value="hope_latina">Latina</option>
            </select>
          </div>
        </div>
      )}

      <div className="input-area">
        <div className="input-function">
          <button onClick={() => { setIsImage((v) => !v); if (!isImage) setInput("Erstelle ein Bild: "); }} className="button">
            <FontAwesomeIcon icon={faImage} className={isImage ? "image-choose" : "image"} />
          </button>
          <button onClick={toggleRecord} disabled={isLoading} className="button">
            <FontAwesomeIcon icon={recording ? faStop : faMicrophone} className={recording ? "record" : "not-record"} />
          </button>
          {enableTTS && (
            <button onClick={() => setTtsMuted((v) => !v)} className="button">
              <FontAwesomeIcon icon={ttsMuted ? faVolumeMute : faVolumeHigh} />
            </button>
          )}
          <button onClick={() => {
            const last = [...messages].reverse().find((m) => m.type === "bot" && m.content);
            if (last && enableTTS && !ttsMuted) speakText(last.content!);
          }} className="button">
            <FontAwesomeIcon icon={faRepeat} />
          </button>
        </div>
        <div className="input-chat-mode">
          <button onClick={() => setShowSettings((v) => !v)} className="button">
            <FontAwesomeIcon icon={faGear} />
          </button>
          <textarea className="text-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Nachricht eingeben..." />
          <button onClick={handleSend} disabled={isLoading} className="button send">
            <FontAwesomeIcon spin={isLoading} icon={isLoading ? faSpinner : faSave} />
          </button>
        </div>
      </div>
    </div>
  );
});