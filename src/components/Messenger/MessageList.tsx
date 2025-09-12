import React, { useEffect, useMemo, useState } from "react";
import type { MessengerMessage, UserType } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat, faRobot, faUser } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";

type MessageListProps = {
  messages: MessengerMessage[];
  renderMessage?: (m: MessengerMessage) => React.ReactNode;
  onOpenImage: (base64: string) => void;
  endRef: React.RefObject<HTMLDivElement | null> | null;
  onRespeakLast: (message: MessengerMessage) => void;
  labelUser?: Record<UserType, string> | undefined;
  iconUser?: Record<UserType, React.ReactNode> | undefined; // Fallback
  imageBackGroundStyle?: React.CSSProperties;
};

// LocalStorage Keys
const LS_BG = "messenger:bgImage";
const LS_AVATAR = "messenger:userAvatar";

// Helpers
function normalizeDataUrl(s: string) {
  if (!s) return s;
  return s.startsWith("data:") ? s : `data:image/png;base64,${s}`;
}

function toArray(img?: unknown): string[] {
  if (!img) return [];
  if (Array.isArray(img)) return img.filter(Boolean) as string[];
  if (typeof img === "string") return [img];
  return [];
}

/** Mini-Galerie für mehrere Bilder */
function ImageGallery({
  images,
  onOpen,
}: {
  images: string[];
  onOpen: (b64: string) => void;
}) {
  const norm = useMemo(() => images.map(normalizeDataUrl), [images]);

  // Ab 5 Bildern: ein hero + Grid, sonst nur Grid
  if (norm.length >= 5) {
    const [hero, ...rest] = norm;
    return (
      <div className="image-gallery">
        <div className="image-hero" onClick={() => onOpen(hero)} role="button" aria-label="open image">
          <img src={hero} alt="img" loading="lazy" />
        </div>
        <div className="image-grid">
          {rest.map((src, i) => (
            <button key={i} className="image-tile" onClick={() => onOpen(src)} aria-label={`open image ${i + 2}`}>
              <img src={src} alt={`img-${i + 2}`} loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 2–4 Bilder: gleichmäßiges Grid
  return (
    <div className="image-grid">
      {norm.map((src, i) => (
        <button key={i} className="image-tile" onClick={() => onOpen(src)} aria-label={`open image ${i + 1}`}>
          <img src={src} alt={`img-${i + 1}`} loading="lazy" />
        </button>
      ))}
    </div>
  );
}

export function MessageList({
  messages,
  renderMessage,
  onOpenImage,
  endRef,
  onRespeakLast,
  labelUser = { user: "User", bot: "Bot" },
  iconUser = { user: <FontAwesomeIcon icon={faUser} />, bot: <FontAwesomeIcon icon={faRobot} /> },
  imageBackGroundStyle,
}: MessageListProps) {
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const b = localStorage.getItem(LS_BG);
      const a = localStorage.getItem(LS_AVATAR);
      if (b) setBgUrl(b);
      if (a) setAvatarUrl(a);
    } catch { }
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_BG) setBgUrl(e.newValue ?? null);
      if (e.key === LS_AVATAR) setAvatarUrl(e.newValue ?? null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Avatar (für Bot) aus LocalStorage, sonst Fallback-Icons
  const finalIcons = useMemo<Record<UserType, React.ReactNode>>(
    () => ({
      bot: avatarUrl ? (
        <img
          src={avatarUrl}
          alt="avatar"
          style={{
            width: "1.4rem",
            height: "1.4rem",
            objectFit: "cover",
            borderRadius: "9999px",
            border: "2px solid rgba(255,255,255,0.8)",
          }}
        />
      ) : (
        iconUser.bot ?? <FontAwesomeIcon icon={faRobot} />
      ),
      user: iconUser.user ?? <FontAwesomeIcon icon={faUser} />,
    }),
    [avatarUrl, iconUser]
  );

  function renderMessageDefault(m: MessengerMessage) {
    return m.content
      ? typeof m.content === "string"
        ? m.content.split(/(\*[^*]+\*)/g).map((part, i) =>
          part.startsWith("*") && part.endsWith("*") ? (
            <span key={i} style={{ opacity: 0.6 }}>{part.slice(1, -1)}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )
        : m.content
      : m.content;
  }

  const defaultRenderer = (m: MessengerMessage) => {
    const imgs = toArray(m.image);

    return (
      <div key={m.id ?? String(m.createdAt)} className={`message ${m.type}`}>
        <div className={`message-bubble-container-${m.type}`}>
          <div className={`message-bubble-type`}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {finalIcons[m.type]}
              <div className="message-bubble-label">{labelUser[m.type]}</div>
            </div>
            <Button
              icon={faRepeat}
              color={m.type === "user" ? "primary" : "secondary"}
              height="1.7rem"
              width="1.7rem"
              onClick={() => onRespeakLast(m)}
            />
          </div>

          {typeof m.content === "string" && m.content.trim() !== "" ? (
            <div className="message-bubble">{renderMessageDefault(m)}</div>
          ) : null}

          {imgs.length === 1 && (
            <div className="message-image-container" style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={normalizeDataUrl(imgs[0])}
                alt="img"
                className="message-image"
                onClick={() => onOpenImage(imgs[0]!)}
                style={{ cursor: "pointer" }}
                loading="lazy"
              />
            </div>
          )}

          {imgs.length > 1 && <ImageGallery images={imgs} onOpen={onOpenImage} />}
        </div>
      </div>
    );
  };

  return (
      <div
        className="messages"
        style={bgUrl ? imageBackGroundStyle : undefined}
      >
        {messages.map((m) => (renderMessage ? renderMessage(m) : defaultRenderer(m)))}
        <div ref={endRef} />
      </div>
  );
}
