// Ask for username and save to sessionStorage
const username = sessionStorage.getItem("username");
const MAX_LENGTH = 20;

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


var latitude = null;
var longitude = null;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            // console.log('Latitude:', latitude, 'Longitude:', longitude);
        },
        function (error) {
            console.log("Error getting current position:", error);
        }
    );
} else {
    console.log("Geolocation is not supported by this browser.");
}


//register service worker
const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("/sw.js");
            if (registration.installing) {
                console.log("Service worker installing");
            } else if (registration.waiting) {
                console.log("Service worker installed");
            } else if (registration.active) {
                console.log("Service worker active");
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};


registerServiceWorker();


async function deleteSighting(event, id) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this sighting?")) {
        // POST request if user clicked ok
        fetch(`/delete?id=${id}`, { method: "POST" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Response was not ok");
                }
                location.reload();
            })
            .catch((error) => {
                console.error("There was a problem deleting the sighting:", error);
            });
    } else {
        // do nothing if user clicked cancel
        return;
    }
}

import {openSightingDB, putSighting, setSighting, getSighting, getAllSightings, clearSightings} from './idb.js';

//open idb
openSightingDB()





// Get all the elements that need the click event listener
const elements = document.querySelectorAll('.card, #table-body-distance tr, #table-body-date tr');

// Add the click event listener to each element
elements.forEach(element => {
    element.addEventListener('click', (event) => {
        // Get the sighting data from the clicked element
        const sighting = JSON.parse(element.dataset.sighting);

        // Add sighting to IndexedDB
         putSighting(sighting).then(() => {
             console.log("Sighting created successfully in indexedDB!");
        }).catch((error) => {
             console.log("Error creating sighting");
         }
        )

        if (sighting._id) {
            const id = sighting._id;
            // Redirect to the details page
            window.location.href = `/details?id=${id}`;
        }
    });
});




/**
 * When the client gets off-line, it shows an off line warning to the user
 * so that it is clear that the data is stale
 */
window.addEventListener('offline', function(e) {
  // Queue up events for server.
  console.log("You are offline");
}, false);


let defaultLocalId = "1";
async function uploadNewCreateData() {
    sighting = await getSighting(defaultLocalId);
    const formData = new FormData();
    for (const key in sighting) {
        formData.append(key, sighting[key]);
    }

    const response = await fetch("/add", {
        method: "POST",
        body: formData,
    });
    return response;
}

async function updateDataMessage() {
    const sightings = await getAllSightings();
    const formDataArray = [];

    sightings.forEach((sighting) => {
        const formData = new FormData();

        for (const key in sighting) {
            formData.append(key, sighting[key]);
        }

        formDataArray.push(formData);
    });

    const response = await fetch('/upload', {
        method: 'POST',
        body: JSON.stringify(formDataArray),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response;
}


/**
 * When the client gets online, it hides the off line warning
 */
window.addEventListener('online', async function (e) {
    // Resync data with server.
    console.log("You are online");

    uploadNewCreateData().then(r => console.log("upload new data success")).catch(e => console.log(e.error()));
    updateDataMessage().then(r => console.log("update message success")).catch(e => console.log(e.error()));
    // clean indexedDB
    await clearSightings();

}, false);


// function showOfflineWarning() {
//   if (document.getElementById('offline_div') != null)
//     document.getElementById('offline_div').style.display = 'block';
// }
//
// function hideOfflineWarning() {
//   if (document.getElementById('offline_div') != null)
//     document.getElementById('offline_div').style.display = 'none';
// }





