// Ask for username and save to sessionStorage
const username = sessionStorage.getItem("username");
const MAX_LENGTH = 20;

let db = null;
const dbName = 'sightingsDB';
const dbVersion = 1;
const objectStoreName = 'sightings';


if (!username) {
    let isValid = false;
    while (!isValid) {
    const username = prompt(
    "Please enter your username (no more than 20 characters):"
    );
    if (username && username.length <= MAX_LENGTH) {
    sessionStorage.setItem("username", username);
    isValid = true;
    }
 }
}




function openSightingsDB() {
    // Check if the database is already open
    if (db) {
        console.log("Database is already open");
        return;
    }

    const openRequest = indexedDB.open(dbName, dbVersion);

    openRequest.onupgradeneeded = function(event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore(objectStoreName, { keyPath: '_id' });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
    };

    openRequest.onsuccess = function(event) {
        db = event.target.result;
        console.log("Database opened successfully");
        // store a new sighting or comment while offline
    };
}

try {
    openSightingsDB()
}catch (e) {
    console.log(e)
}




async function addSighting(sighting) {
    openSightingsDB();
    const transaction = db.transaction([objectStoreName], 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);

    // Add the sighting to the store
    await objectStore.add(sighting);

    transaction.oncomplete = function () {
        console.log('Sighting added to IndexedDB');
    };
}

//register service worker
navigator.serviceWorker.register("serviceworker.js").then(
    (register)=>{
        console.log("Registered: "+register.scope)
    },
    (err)=>{
        console.log("Failed registration"+err)
    }
)




