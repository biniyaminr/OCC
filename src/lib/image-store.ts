/**
 * Uploaded images are far too large for localStorage, so they live in IndexedDB
 * as blobs. The saved content JSON only keeps `idb:<id>` references, and the
 * provider swaps those for object URLs while the app is running.
 */
const DB_NAME = "occ-content";
const DB_VERSION = 1;
const STORE = "images";
const REF_PREFIX = "idb:";

export function isImageRef(value: string) {
  return value.startsWith(REF_PREFIX);
}

export function refId(ref: string) {
  return ref.slice(REF_PREFIX.length);
}

export function makeRef(id: string) {
  return `${REF_PREFIX}${id}`;
}

export function isDataImage(value: string) {
  return value.startsWith("data:image");
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is unavailable"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB failed to open"));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T> | null,
): Promise<T | undefined> {
  const db = await openDb();
  try {
    return await new Promise<T | undefined>((resolve, reject) => {
      const transaction = db.transaction(STORE, mode);
      const request = run(transaction.objectStore(STORE));
      transaction.onabort = () => reject(transaction.error ?? new Error("Image storage failed"));
      transaction.oncomplete = () => resolve(request?.result);
      transaction.onerror = () => reject(transaction.error ?? new Error("Image storage failed"));
    });
  } finally {
    db.close();
  }
}

export async function putImage(id: string, blob: Blob) {
  await withStore("readwrite", (store) => store.put(blob, id));
}

export async function getImage(id: string): Promise<Blob | undefined> {
  return await withStore<Blob>("readonly", (store) => store.get(id) as IDBRequest<Blob>);
}

export async function listImageIds(): Promise<string[]> {
  const keys = await withStore<IDBValidKey[]>(
    "readonly",
    (store) => store.getAllKeys() as IDBRequest<IDBValidKey[]>,
  );
  return (keys ?? []).map(String);
}

export async function deleteImages(ids: string[]) {
  if (ids.length === 0) return;
  await withStore("readwrite", (store) => {
    ids.forEach((id) => store.delete(id));
    return null;
  });
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return await (await fetch(dataUrl)).blob();
}
