import React, { useEffect, useMemo, useState } from "react";
import type { MessengerMessage, UserType } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat, faRobot, faUser } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import { width } from "@fortawesome/free-brands-svg-icons/fa11ty";

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

    const defaultRenderer = (m: MessengerMessage) => (
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

                <div className="message-bubble">{m.content}</div>

                {m.image && (
                    <div className="message-image-container" style={{ display: "flex", justifyContent: "center" }}>
                        <img
                            src={normalizeDataUrl(m.image)}
                            alt="img"
                            className="message-image"
                            onClick={() => onOpenImage(m.image!)}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div
            className="messages"
            style={bgUrl ? imageBackGroundStyle : { width: "100%", height: "100%" }}
        >
            {messages.map((m) => (renderMessage ? renderMessage(m) : defaultRenderer(m)))}
            <div ref={endRef} />
        </div>
    );
}
