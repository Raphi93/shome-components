import React, { forwardRef } from "react";
import "./Messenger.css";
import { MessageList } from "./MessageList";
import { MessengerSettings } from "./MessengerSettings";
import { MessengerInput } from "./MessengerInput";
import type { MessengerHandle, MessengerProps } from "./types";
import { useMessengerState } from "./useMessengerState";

// Neu: Quick-Actions im Fullscreen
import Button from "../Button/Button";
import { faDownload, faImage as faImageIcon, faUser, faX } from "@fortawesome/free-solid-svg-icons";

const LS_BG = "messenger:bgImage";
const LS_AVATAR = "messenger:userAvatar";

function normalizeDataUrl(s?: string | null) {
    if (!s) return "";
    return s.startsWith("data:") ? s : `data:image/png;base64,${s}`;
}

export const Messenger = forwardRef<MessengerHandle, MessengerProps>(function Messenger(props, ref) {
    const s = useMessengerState(props, ref);

    const {
        visibleMessages, renderMessage, endRef, fullscreenImage, setFullscreenImage,
        messages, enableTTS, ttsMuted, isLoading, enableSTT,
        input, setInput, inputPlaceholder, recording, toggleRecord,
        setShowSettings, showSettings, handleSend,
        settingsSchema, settings, setSettings, deleteHistoryAll,
        getTextValue, getNumberValue, getBooleanValue, imageBackGroundStyle,
        labelUser, labelSendButton, childrenButtons, isLightColor
    } = s;

    // ----- Fullscreen-QuickActions -----
    function handleDownload() {
        if (!fullscreenImage) return;
        const url = normalizeDataUrl(fullscreenImage);
        const a = document.createElement("a");
        a.href = url;
        a.download = `image_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    function handleSetBackground() {
        if (!fullscreenImage) return;
        const url = normalizeDataUrl(fullscreenImage);
        localStorage.setItem(LS_BG, url);
    }

    function handleSetAvatar() {
        if (!fullscreenImage) return;
        const url = normalizeDataUrl(fullscreenImage);
        localStorage.setItem(LS_AVATAR, url);
    }
    // -----------------------------------

    return (
        <div className="chat-container">
            <MessageList
                messages={visibleMessages}
                renderMessage={renderMessage}
                onOpenImage={(b64) => setFullscreenImage(b64)}
                endRef={endRef}
                onRespeakLast={(message) => {
                    if (message && enableTTS && !ttsMuted) s.speakText(message.content!);
                }}
                labelUser={labelUser}
                imageBackGroundStyle={imageBackGroundStyle}
            />

            {fullscreenImage && (
                <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
                    <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
                        <div className="fullscreen-actions" style={{ display: "flex", gap: ".5rem", marginBottom: ".5rem", justifyContent: "flex-end" }}>
                            <Button
                                icon={faDownload}
                                color="light"
                                isLightColor
                                tooltip="Auf Gerät speichern"
                                height="1.9rem"
                                width="1.9rem"
                                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                            />
                            <Button
                                icon={faImageIcon}
                                color="light"
                                isLightColor
                                tooltip="Als Hintergrund setzen"
                                height="1.9rem"
                                width="1.9rem"
                                onClick={(e) => { e.stopPropagation(); handleSetBackground(); }}
                            />
                            <Button
                                icon={faUser}
                                color="light"
                                isLightColor
                                tooltip="Als User-Avatar setzen"
                                height="1.9rem"
                                width="1.9rem"
                                onClick={(e) => { e.stopPropagation(); handleSetAvatar(); }}
                            />
                            <Button
                                icon={faX}
                                color="light"
                                isLightColor
                                tooltip="Close"
                                height="1.9rem"
                                width="1.9rem"
                                onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }}
                            />
                        </div>

                        <img
                            src={normalizeDataUrl(fullscreenImage)}
                            alt="full"
                            className="fullscreen-image"
                        />
                    </div>
                </div>
            )}

            {showSettings && (
                <MessengerSettings
                    settingsSchema={settingsSchema ?? []}
                    settings={settings}
                    setSettings={setSettings}
                    isIndexDb={!!props.isIndexDb}
                    onDeleteHistory={deleteHistoryAll}
                    labelDeleteHistory={props.LabelDeleteHistory}
                    getTextValue={getTextValue}
                    getNumberValue={getNumberValue}
                    getBooleanValue={getBooleanValue}
                    isLightColor={isLightColor}
                />
            )}

            <MessengerInput
                input={input}
                setInput={setInput}
                inputPlaceholder={inputPlaceholder}
                isLoading={!!isLoading}
                enableSTT={!!enableSTT}
                enableTTS={!!props.enableTTS}
                recording={!!recording}
                ttsMuted={!!s.ttsMuted}
                setTtsMuted={(fn) => s.setTtsMuted(fn(s.ttsMuted))}
                onToggleRecord={toggleRecord}
                settingsOpen={!showSettings}
                onToggleSettings={() => setShowSettings(v => !v)}
                onSend={handleSend}
                labelSendButton={labelSendButton}
                childrenButtons={childrenButtons}
                isLightColor={isLightColor}
            />
        </div>
    );
});
