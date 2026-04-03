'use client';

import { useCallback, useEffect, useState } from 'react';

import type { ChatBotMessage } from './ChatBot.types';

const STORE = 'messages';
const VERSION = 1;

export type StoredChatMessage = ChatBotMessage & {
  key: string; // `${user}_${id}`
  user: string;
};

function openDb(dbName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'key' });
        store.createIndex('user', 'user', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('user_createdAt', ['user', 'createdAt'], { unique: false });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

async function idbUpsertMessageRaw(dbName: string, user: string, message: ChatBotMessage) {
  const db = await openDb(dbName);
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);

  const toStore: StoredChatMessage = {
    ...message,
    createdAt: typeof message.createdAt === 'number' ? message.createdAt : Date.now(),
    key: `${user}_${message.id}`,
    user,
  };

  store.put(toStore);
  await txDone(tx);
  db.close();
}

async function idbGetMessagesByUserRaw(dbName: string, user: string): Promise<StoredChatMessage[]> {
  const db = await openDb(dbName);
  const tx = db.transaction(STORE, 'readonly');
  const store = tx.objectStore(STORE);

  // IMPORTANT: use composite index to get correct order directly
  const idx = store.index('user_createdAt');
  const range = IDBKeyRange.bound([user, -Infinity], [user, Infinity]);

  const req = idx.getAll(range);

  const items = await new Promise<StoredChatMessage[]>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result as StoredChatMessage[]);
    req.onerror = () => reject(req.error);
  });

  await txDone(tx);
  db.close();

  // already sorted by the index, but keep safe:
  return items.sort((a, b) => a.createdAt - b.createdAt);
}

async function idbClearUserRaw(dbName: string, user: string) {
  const db = await openDb(dbName);
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  const idx = store.index('user');

  const range = IDBKeyRange.only(user);
  const req = idx.openCursor(range);

  await new Promise<void>((resolve, reject) => {
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) return resolve();
      cursor.delete();
      cursor.continue();
    };
    req.onerror = () => reject(req.error);
  });

  await txDone(tx);
  db.close();
}

async function idbDeleteDatabaseRaw(dbName: string) {
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(dbName);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
}

export function useChatIndexDb(params: { dbName: string; user: string; enabled: boolean; autoLoad?: boolean }) {
  const { dbName, user, enabled, autoLoad = true } = params;

  const [loadedMessages, setLoadedMessages] = useState<StoredChatMessage[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);

    try {
      const msgs = await idbGetMessagesByUserRaw(dbName, user);
      setLoadedMessages(msgs);
    } catch (e) {
      setError(e);
      setLoadedMessages(null);
    } finally {
      setLoading(false);
    }
  }, [dbName, user, enabled]);

  const upsert = useCallback(
    async (message: ChatBotMessage) => {
      if (!enabled) return;
      if (!message?.id) return;
      await idbUpsertMessageRaw(dbName, user, message);
    },
    [dbName, user, enabled]
  );

  const clearUser = useCallback(async () => {
    if (!enabled) return;
    await idbClearUserRaw(dbName, user);
    setLoadedMessages([]);
  }, [dbName, user, enabled]);

  const deleteDb = useCallback(async () => {
    await idbDeleteDatabaseRaw(dbName);
    setLoadedMessages(null);
  }, [dbName]);

  useEffect(() => {
    if (!enabled) return;
    if (!autoLoad) return;
    load();
  }, [enabled, autoLoad, load]);

  return {
    loadedMessages,
    loading,
    error,
    load,
    upsert,
    clearUser,
    deleteDb,
  };
}