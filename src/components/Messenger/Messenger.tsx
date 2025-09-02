import React, { forwardRef } from "react";
import "./Messenger.css";
import { MessageList } from "./MessageList";
import { MessengerSettings } from "./MessengerSettings";
import { MessengerInput } from "./MessengerInput";
import type { MessengerHandle, MessengerProps } from "./types";
import { useMessengerState } from "./useMessengerState";

export const Messenger = forwardRef<MessengerHandle, MessengerProps>(function Messenger(props, ref) {
    const s = useMessengerState(props, ref);

    const {
        visibleMessages, renderMessage, endRef, fullscreenImage, setFullscreenImage,
        messages, enableTTS, ttsMuted, speakText, isLoading, enableSTT,
        input, setInput, inputPlaceholder, recording, toggleRecord,
        setShowSettings, showSettings, handleSend,
        settingsSchema, settings, setSettings, deleteHistoryAll,
        getTextValue, getNumberValue, getBooleanValue, ttsDefaultOn,
        labelUser, labelSendButton, childrenButtons, isLightColor
    } = s;

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
            />

            {fullscreenImage && (
                <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
                    <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setFullscreenImage(null)}>✖</button>
                        <img src={`data:image/png;base64,${fullscreenImage}`} alt="full" className="fullscreen-image" />
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
                enableTTS={!!enableTTS}
                recording={!!recording}
                ttsMuted={!!ttsMuted}
                setTtsMuted={(fn) => s.setTtsMuted(fn(ttsMuted))}
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
