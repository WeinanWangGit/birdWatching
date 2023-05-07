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


<!--    get current location-->
var latitude = null;
var longitude = null;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            // console.log('Latitude:', latitude, 'Longitude:', longitude);
            // alert('您选择的位置是：' + latitude + ',' + longitude);
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

