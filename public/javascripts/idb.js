const dbName = "sightingsDB";
const dbVersion = 1;
const objectStoreName = "sightings";

let db = null;

export async function openSightingDB() {
  if (db) {
    console.log("Database is already open");
    return;
  }

  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(dbName, dbVersion);

    openRequest.onsuccess = function (event) {
      db = event.target.result;
      console.log("openDb DONE");
      resolve();
    };

    openRequest.onerror = function (event) {
      console.error("openDb:", event.target.errorCode);
      reject(event.target.errorCode);
    };

    openRequest.onupgradeneeded = function (event) {
      db = event.target.result;
      const objectStore = db.createObjectStore(objectStoreName, {
        keyPath: "_id",
      });
      objectStore.createIndex("timestamp", "timestamp", { unique: false });
    };
  });
}

export async function getSighting(key) {
  await openSightingDB();
  const transaction = db.transaction([objectStoreName], "readonly");
  const objectStore = transaction.objectStore(objectStoreName);
  const req = objectStore.get(key);

  return await new Promise((resolve, reject) => {
    req.onsuccess = function (evt) {
      const value = evt.target.result;
      resolve(value);
    };

    req.onerror = function (evt) {
      reject(evt.target.error);
    };
  });
}

export async function setSighting(sighting) {
  await openSightingDB();
  console.log(sighting, db);
  const transaction = db.transaction([objectStoreName], "readwrite");
  const objectStore = transaction.objectStore(objectStoreName);

  await objectStore.add(sighting);

  transaction.oncomplete = function () {
    console.log("sighting added to idb");
  };
}

export async function putSighting(sighting) {
  await openSightingDB();
  console.log(sighting, db);
  const transaction = db.transaction([objectStoreName], "readwrite");
  const objectStore = transaction.objectStore(objectStoreName);

  await objectStore.put(sighting);

  transaction.oncomplete = function () {
    console.log("sighting added to idb");
  };
}

export async function getAllSightings() {
  await openSightingDB();
  const transaction = db.transaction([objectStoreName], "readonly");
  const objectStore = transaction.objectStore(objectStoreName);
  const req = objectStore.getAll();

  return new Promise((resolve, reject) => {
    req.onsuccess = function (event) {
      const sightings = event.target.result;
      resolve(sightings);
    };

    req.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

export async function clearSightings() {
  await openSightingDB();
  const transaction = db.transaction([objectStoreName], "readwrite");
  const objectStore = transaction.objectStore(objectStoreName);
  const req = objectStore.clear();

  return new Promise((resolve, reject) => {
    req.onsuccess = function () {
      resolve();
    };

    req.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

export async function displayChatHistory(key) {
  await openSightingDB();
  const transaction = db.transaction([objectStoreName], "readonly");
  const objectStore = transaction.objectStore(objectStoreName);
  const req = objectStore.get(key);

  req.onsuccess = function (event) {
    const messages = event.target.result.messages;
    for (let i = 0; i < messages?.length; i++) {
      let message = messages[i];
      let text = message.text;
      let sentAt = message.sentAt;
      //   console.log("I am from displayChat", text, sentAt);
      writeOnHistory(text, sentAt);
    }
  };
}
