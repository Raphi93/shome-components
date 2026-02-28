import { useEffect, useState } from 'react';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { ChatBotMessage } from './ChatBot.types';

import styles from './ChatBox.module.scss';

type AvatarType = 'user' | 'bot';

export function ChatBotMessages({
    messages,
    setMessagesVoice,
}: {
    messages: ChatBotMessage[];
    setMessagesVoice: (message: ChatBotMessage) => void;
}) {
    const [srcUser, setSrcUser] = useState<string | null>(null);
    const [srcBot, setSrcBot] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const u = localStorage.getItem('chat_avatar_user');
        const b = localStorage.getItem('chat_avatar_bot');

        if (u) setSrcUser(u);
        if (b) setSrcBot(b);
    }, []);

    return (
        <div className={styles['chat-box-messages-list']}>
            {messages.map(message => (
                <div
                    key={message.id}
                    className={`${styles['chat-message-row']} ${styles[`chat-message-row-${message.sender}`]}`}
                >
                    <ChatBotMessageBubble
                        message={message}
                        setMessagesVoice={setMessagesVoice}
                        srcUser={srcUser}
                        setSrcUser={setSrcUser}
                        srcBot={srcBot}
                        setSrcBot={setSrcBot}
                    />
                </div>
            ))}
        </div>
    );
}

function ChatBotMessageBubble({
    message,
    setMessagesVoice,
    srcUser,
    setSrcUser,
    srcBot,
    setSrcBot,
}: {
    message: ChatBotMessage;
    setMessagesVoice: (message: ChatBotMessage) => void;
    srcUser: string | null;
    setSrcUser: React.Dispatch<React.SetStateAction<string | null>>;
    srcBot: string | null;
    setSrcBot: React.Dispatch<React.SetStateAction<string | null>>;
}) {
    const isUser = message.sender === 'user';

    const src = isUser ? srcUser : srcBot;
    const avatarType: AvatarType = isUser ? 'user' : 'bot';

    function saveAvatar(type: AvatarType, dataUrl: string) {
        if (type === 'user') setSrcUser(dataUrl);
        else setSrcBot(dataUrl);

        try {
            localStorage.setItem(`chat_avatar_${type}`, dataUrl);
        } catch (e) {
            console.warn('Avatar speichern fehlgeschlagen', e);
        }
    }

    function handleClickAvatar(type: AvatarType) {
        if (typeof window === 'undefined') return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = () => {
                const result = typeof reader.result === 'string' ? reader.result : null;
                if (!result) return;
                saveAvatar(type, result);
            };

            reader.readAsDataURL(file);
        };

        input.click();
    }

    return (
        <div className={styles['chat-message-container']}>
            <div className={styles['chat-message-overlay']}>
                {/* Links: user-name oder mic */}
                <div className={styles['chat-message-avatar-container']}>
                    {src ? (
                        <img
                            className={styles['chat-message-avatar']}
                            src={src}
                            onClick={() => handleClickAvatar(avatarType)}
                            alt="Avatar"
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faUser}
                            className={styles['chat-message-voice-icon']}
                            onClick={() => handleClickAvatar(avatarType)}
                        />
                    )}
                    <div className={styles['chat-message-user-name']}>{message.sender}</div>
                </div>

                <FontAwesomeIcon
                    icon={faMicrophone}
                    className={styles['chat-message-voice-icon']}
                    onClick={() => setMessagesVoice(message)}
                />
            </div>
            <div className={styles['chat-message-text']}>
                {message.text}
            </div>
        </div>
    );
}