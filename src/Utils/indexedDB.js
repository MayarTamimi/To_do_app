const DB_NAME = "coolDB";
const STORE_NAME = "tasks";
const DB_VERSION = 1;

let db = null;

export function openDB(callBack) {
  const req = indexedDB.open(DB_NAME, DB_VERSION);

  req.onupgradeneeded = function (e) {
    const database = e.target.result;
    if (!database.objectStoreNames.contains(STORE_NAME)) {
      database.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  };

  req.onsuccess = function (e) {
    db = e.target.result;
    callBack(db);
  };

  req.onerror = databaseError;
}

function databaseError(err) {
  console.error("IndexedDB error:", err);
}

export function addTaskToIndexedDB(tasks, onComplete) {
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  tasks.forEach((task) => {
    store.put({ ...task, statusId: task.status?.id || "" });
  });

  tx.oncomplete = () => onComplete?.();
  tx.onerror = (err) => console.error("saveTasks error", err);
}

export function getAllTasks(onSuccess) {
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const req = store.openCursor();
  const all = [];

  req.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      all.push(cursor.value);
      cursor.continue();
    } else {
      onSuccess(all);
    }
  };

  req.onerror = (e) => console.error("getAllTasks error:", e);
}
