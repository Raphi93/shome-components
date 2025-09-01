const IDB_NAME = "MessengerDB";
const IDB_VERSION = 1;
const IDB_STORE = "kv";

function idbOpen(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function idbGet<T = unknown>(key: string): Promise<T | undefined> {
  return idbOpen().then(db => new Promise((res, rej) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(key);
    req.onsuccess = () => res(req.result as T | undefined);
    req.onerror = () => rej(req.error);
  }));
}

export function idbSet(key: string, value: unknown): Promise<void> {
  return idbOpen().then(db => new Promise((res, rej) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    const req = tx.objectStore(IDB_STORE).put(value, key);
    req.onsuccess = () => res();
    req.onerror = () => rej(req.error);
  }));
}

export function idbDel(key: string): Promise<void> {
  return idbOpen().then(db => new Promise((res, rej) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    const req = tx.objectStore(IDB_STORE).delete(key);
    req.onsuccess = () => res();
    req.onerror = () => rej(req.error);
  }));
}
