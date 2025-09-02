import React from "react";
import { Button, TextArea } from "../index";
import { faGear, faMicrophone, faPaperPlane, faStop, faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";

type MessengerInputProps = {
    input: string;
    setInput: (v: string) => void;
    inputPlaceholder: string;
    isLoading: boolean;
    enableSTT: boolean;
    enableTTS: boolean;
    recording: boolean;
    ttsMuted: boolean;
    setTtsMuted: (f: (v: boolean) => boolean) => void;
    onToggleRecord: () => void;
    onToggleSettings: () => void;
    onSend: () => void;
    childrenButtons?: React.ReactNode;
    labelSendButton?: string;
    settingsOpen: boolean;
    isLightColor?: boolean;
};

export function MessengerInput({
    input, setInput, inputPlaceholder, isLoading,
    enableSTT, enableTTS, recording, ttsMuted, setTtsMuted,
    onToggleRecord, onToggleSettings, onSend, childrenButtons, labelSendButton = "Send",
    settingsOpen, isLightColor
}: MessengerInputProps) {

    return (
        <div className="input-area">
            <div className="input-function">
                {childrenButtons}
                <Button isLightColor={isLightColor} icon={recording ? faStop : faMicrophone} onClick={onToggleRecord} disabled={isLoading || !enableSTT} />
                {enableTTS && <Button isLightColor={isLightColor} icon={ttsMuted ? faVolumeMute : faVolumeHigh} onClick={() => setTtsMuted(v => !v)} />}
            </div>
            <div className="input-chat-mode">
                <Button
                    icon={faGear}
                    color="info"
                    isLightColor={isLightColor}
                    expander
                    expanderValue={settingsOpen}
                    onClick={onToggleSettings}
                    width="5rem"
                    height="2.8rem"
                />
                <TextArea label={inputPlaceholder} value={input} onChange={setInput} rows={1} />
                <Button
                    icon={faPaperPlane}
                    color="success"
                    text={labelSendButton}
                    isLightColor={isLightColor}
                    isLoading={isLoading}
                    onClick={onSend}
                    disabled={isLoading}
                    width="120px"
                    height="2.8rem"
                    fontSize="0.8rem"
                />
            </div>
        </div>
    );
}
