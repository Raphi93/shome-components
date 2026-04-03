'use client';

import { useEffect, useRef, useState } from 'react';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import type { ChatBotMessage, ChatBotProps } from './ChatBot.types';
import { ChatBotMessages } from './ChatBotMessage';
import { useChatIndexDb } from './useChatIndexDb';

import styles from './ChatBox.module.scss';
import { TextareaAutoheight } from '../FieldWrapper';
import { Button } from '../Button';

function normalizeAndSort(list: ChatBotMessage[]) {
  return [...list]
    .map(m => ({
      ...m,
      createdAt: typeof m.createdAt === 'number' ? m.createdAt : Date.now(),
    }))
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function ChatBot({
  preLoadedMessages,
  chatButtomChildren,
  setMessagesVoice,
  newMessage,
  user,
  indexDbName,
  isIndexDb,
  handleSendMessage: handleSendMessageProp,
}: ChatBotProps) {
  const [taKey, setTaKey] = useState(0);

  // IMPORTANT: start empty if IDB is enabled to avoid preload/overwrite flicker
  const [messages, setMessages] = useState<ChatBotMessage[]>(
    isIndexDb ? [] : normalizeAndSort(preLoadedMessages ?? [])
  );

  const [userMessageLast, setUserMessageLast] = useState<ChatBotMessage>({
    id: '',
    text: '',
    sender: 'user',
    createdAt: Date.now(),
  });

  const idb = useChatIndexDb({
    dbName: indexDbName,
    user,
    enabled: isIndexDb,
    autoLoad: true,
  });

  const lastProcessedNewMessageIdRef = useRef<string>('');
  const hydratedKeyRef = useRef<string>('');

  // 1) hydrate from IDB ONCE per (dbName+user)
  useEffect(() => {
    if (!isIndexDb) return;
    if (!idb.loadedMessages) return;

    const hydrateKey = `${indexDbName}__${user}`;
    if (hydratedKeyRef.current === hydrateKey) return;

    hydratedKeyRef.current = hydrateKey;
    setMessages(normalizeAndSort(idb.loadedMessages));
  }, [isIndexDb, idb.loadedMessages, indexDbName, user]);

  // if not IDB, update from preLoadedMessages changes
  useEffect(() => {
    if (isIndexDb) return;
    setMessages(normalizeAndSort(preLoadedMessages ?? []));
  }, [isIndexDb, preLoadedMessages]);

  // 2) apply incoming newMessage once, finish last loading, persist
  useEffect(() => {
    if (!newMessage?.id || !newMessage.text) return;
    if (lastProcessedNewMessageIdRef.current === newMessage.id) return;

    lastProcessedNewMessageIdRef.current = newMessage.id;

    setMessages(prev => {
      const lastLoading = [...prev].reverse().find(m => m.loading);

      const cleared = lastLoading
        ? prev.map(m => (m.id === lastLoading.id ? { ...m, loading: false } : m))
        : prev;

      const incoming: ChatBotMessage = {
        ...newMessage,
        createdAt: typeof newMessage.createdAt === 'number' ? newMessage.createdAt : Date.now(),
      };

      // avoid duplicates
      if (cleared.some(m => m.id === incoming.id)) return normalizeAndSort(cleared);

      return normalizeAndSort([...cleared, incoming]);
    });

    if (!isIndexDb) return;

    (async () => {
      try {
        await idb.upsert({
          ...newMessage,
          createdAt: typeof newMessage.createdAt === 'number' ? newMessage.createdAt : Date.now(),
        });
      } catch (e) {
        console.warn('IDB save failed:', e);
      }
    })();
  }, [newMessage, isIndexDb, idb]);

  // 3) user send -> add + persist + call parent
  async function handleSendMessage() {
    const text = (userMessageLast.text ?? '').trim();
    if (!text) return;

    const now = Date.now();

    const msg: ChatBotMessage = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      loading: true,
      createdAt: now,
    };

    setMessages(prev => normalizeAndSort([...prev, msg]));
    setUserMessageLast({ id: '', text: '', sender: 'user', createdAt: Date.now() });
    setTaKey(k => k + 1);

    if (isIndexDb) {
      try {
        await idb.upsert(msg);
      } catch (e) {
        console.warn('IDB save failed:', e);
      }
    }

    handleSendMessageProp(msg);
  }

  return (
    <div className={styles['chat-container']}>
      <div className={styles['chat-overlay']}>
        <ChatBotMessages messages={messages} setMessagesVoice={setMessagesVoice} />
      </div>

      <div className={styles['chat-box-send']}>
        <div className={styles['chat-box-buttons']}>{chatButtomChildren}</div>

        <div className={styles['chat-box-messages']}>
          <div className={styles['chat-box-messages-text-area']}>
            <TextareaAutoheight
              key={taKey}
              placeholder="Type your message..."
              startRows={2}
              value={userMessageLast.text ?? ''}
              onChange={e => {
                const t = e.target.value;
                setUserMessageLast(prev => ({ ...prev, text: t, sender: 'user' }));
              }}
            />
          </div>

          <div className={styles['chat-box-messages-send-button']}>
            <Button
              icon={faPaperPlane}
              IconClassName={styles['icon-send']}
              style={{ width: '35px', height: '35px', borderRadius: '50%' }}
              onClick={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}