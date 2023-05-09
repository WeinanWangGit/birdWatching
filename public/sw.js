// const dbNAme = 'sightingsDB';
// const dbVersion = 1;
// const objectStoreName = 'sightings';
//
//
// let db = null;

//
// function openSightingDB() {
//     if(db) {
//         console.log("Database is already open");
//         return;
//     }
//     const openRequest = indexedDB.open(dbNAme, dbVersion)
//
//     openRequest.onsuccess = function (event) {
//         db = event.target.result;
//         console.log("openDb DONE");
//     };
//
//     openRequest.onerror = function (event) {
//         console.error("openDb:", event.target.errorCode);
//     };
//
//     openRequest.onupgradeneeded = function (event) {
//         db = event.target.result;
//         const objectStore = db.createObjectStore(objectStoreName, {keyPath: "_id"});
//         objectStore.createIndex('timestamp', 'timestamp', {unique: false})
//     };
// }


const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "/",
            "/public/javascripts/create.js",
            "/public/javascripts/idb.js",
            "/page/create_offline.html",
            "/page/details_offline.html",
            "/stylesheets/create_offline.css",
            "/stylesheets/details_offline.css",
            "/public/uploads/*"
        ]),
    );
});

const putInCache = async (request, response) => {
    const cache = await caches.open("v1");
    await cache.put(request, response);
};

const networkFirst = async ({ request, fallbackUrl}) => {

    //  First try to get the resource from the network
    try {
        const responseFromNetwork = await fetch(request);
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        // putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {

        console.log('get from cache')
        console.log(request)

        // Next try to get the resource from the cache
        const responseFromCache = await caches.match(request);
        if (responseFromCache) {
            return responseFromCache;
        }

        //todo
        // const fallbackResponse = await caches.match(fallbackUrl);
        // if (fallbackResponse) {
        //     return fallbackResponse;
        // }

        // when even the fallback response is not available,
        // there is nothing we can do, but we must always
        // return a Response object
        return new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }

};

self.addEventListener("fetch", (event) => {
    // If url is from external then just skip it
    if (!event.request.url.startsWith(event.currentTarget.origin)) {
        return
    }

    //Ignore any of the API requests as these shouldn't be cached. instead these are stored in the idb
    let ignoreUrls = ['/socket.io/?']

    if (!(ignoreUrls.some(url => event.request.url.startsWith(event.currentTarget.origin + url)))) {
        event.respondWith(
            networkFirst({
                request: event.request,
                fallbackUrl: "/gallery/myLittleVader.jpg",
            })
        );
    }

});



