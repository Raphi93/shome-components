import React from "react";
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
    iconUser?: Record<UserType, React.ReactNode> | undefined;
};

export function MessageList({ messages,
    renderMessage,
    onOpenImage,
    endRef,
    onRespeakLast,
    labelUser = { user: "User", bot: "Bot" },
    iconUser = { user: <FontAwesomeIcon icon={faUser} />, bot: <FontAwesomeIcon icon={faRobot} /> }
}: MessageListProps) {
    const defaultRenderer = (m: MessengerMessage) => (
        <div key={m.id ?? String(m.createdAt)} className={`message ${m.type}`}>
            <div className={`message-bubble-container-${m.type}`}>
                <div className={`message-bubble-type`}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {iconUser[m.type]}
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
                    <div className="message-image-container">
                        <img
                            src={`data:image/png;base64,${m.image}`}
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
        <div className="messages">
            {messages.map(m => (renderMessage ? renderMessage(m) : defaultRenderer(m)))}
            <div ref={endRef} />
        </div>
    );
}
