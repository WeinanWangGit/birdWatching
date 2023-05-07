console.log("Service Worker JavaScript called...")

let dbPromise;

const dbName = 'sightingsDB';
const dbVersion = 1;
const objectStoreName = 'sightings';

const cacheName = "core";
const urlsToCache = [
    '/stylesheets/details.css',
    '/details.ejs' // EJS template to cache
    // '/',
];

openSightingsDB()



self.addEventListener("install", (ev)=>{
    ev.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log("Cache installed successfully");
            })
            .catch((err) => {
                console.error("Failed to install cache:", err);
            })
    );
});

// self.addEventListener('fetch', event => {
//     event.respondWith((async () => {
//         const cache = await caches.open(cacheName);
//         const cachedResponse = await cache.match(event.request);
//
//         if(cachedResponse){
//             return cachedResponse;
//         }else{
//             try{
//                 const fetchResponse = await fetch(event.request)
//                 cache.put(event.request, fetchResponse.clone());
//                 return fetchResponse;
//             }catch (e){
//
//             }
//         }
//
//     }))
// })





self.addEventListener("activate", (ev)=>{
    console.log("activate")
})


self.addEventListener('fetch', (event) => {
    const request = event.request;
    console.log("get fetch")

    // Check if the request is for the details page
    if (request.url.includes('/details?id=')) {
        event.respondWith(
            // Extract the ID parameter from the request URL
            fetch(request).then((response) => {
                console.log("get page from network")
                console.log(response)
                return response;
            }).catch((error) => {
                // Try to fetch the data from IndexedDB
                const id = request.url.split('=')[1];
                console.log(id)
                return dbPromise.then((db) => {
                    return getSighting(db, id);
                }).then((result) => {
                    // If the data was found in IndexedDB, return it as a JSON response
                    if (result) {
                        console.log(result)
                        const headers = new Headers();
                        headers.append('Content-Type', 'application/json');
                        const json = JSON.stringify(result);
                        console.log("get db from indexedDB", json)
                        const html = ejs.render('details', { sighting: result});
                        return new Response(html, { headers: headers});
                        // return new Response(json, { headers });
                    }
                    // If the data was not found in IndexedDB, return a 404 response
                    return new Response('Sighting not found', { status: 404 });
                }).catch((error) => {
                    // If there was an error fetching from IndexedDB, return a 500 response
                    return new Response('Error fetching sighting from IndexedDB', { status: 500 });
                });
            })
        );
    }
});


async function getSighting(db, id) {

    const transaction = db.transaction([objectStoreName], 'readonly');
    const objectStore = transaction.objectStore(objectStoreName);

    // Add the sighting to the store
    let IDBrequest = await objectStore.get(id);
    console.log(IDBrequest)

    transaction.oncomplete = function() {
        console.log('Sighting get from IndexedDB');
    };
    return IDBrequest.result
}





function openSightingsDB() {
    if (dbPromise) {
        console.log("Database is already open");
        return dbPromise;
    }

    const openRequest = indexedDB.open(dbName, dbVersion);

    openRequest.onupgradeneeded = function(event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore(objectStoreName, { keyPath: '_id' });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
    };

    const promise = new Promise((resolve, reject) => {
        openRequest.onerror = function(event) {
            reject("Error opening database");
        };

        openRequest.onsuccess = function(event) {
            const db = event.target.result;
            console.log("Database opened successfully from service worker");
            resolve(db);
        };
    });

    dbPromise = promise;
    return promise;
}

