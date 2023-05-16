// Ask for username and save to sessionStorage
const username = sessionStorage.getItem("username");
const MAX_LENGTH = 20;

// Clean up text, remove single quotes, double quotes, and spaces from the text.
function sanitiseText(text) {
  return text.replace(/['"]/g, "").trim();
}

if (!username) {
  let isValid = false;
  while (!isValid) {
    const username = prompt(
      "Please enter your username (no more than 20 characters):"
    );
    // Clean up the entered username and save it to the username in SessionStorage.
    if (username && username.length <= MAX_LENGTH) {
      const sanitisedUsername = sanitiseText(username);
      sessionStorage.setItem("username", sanitisedUsername);
      isValid = true;
    }
  }
}

var latitude = null;
var longitude = null;
if (navigator.geolocation) {
  // Obtain the longitude and latitude of the current position.
  navigator.geolocation.getCurrentPosition(
    function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
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

async function deleteSighting(event, id, author) {
  event.preventDefault();

  const username = sessionStorage.getItem("username");
  // console.log(username, author, id);

  if (author !== username) {
    alert("Sorry, you don't have permission to delete this sighting.");
    return; // Exit the function if user is not the author
  }

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

import {
  openSightingDB,
  putSighting,
  setSighting,
  getSighting,
  getAllSightings,
  clearSightings,
} from "./idb.js";

//open idb
openSightingDB();

// Get elements and add eventListeners
document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.matches(".card, #details-btn")) {
    // Get the sighting data from the clicked element
    const sighting = JSON.parse(target.dataset.sighting);

    const imageURL = sighting.image;

    // Fetch the image file
    fetch(`http://localhost:3000/${imageURL}`)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a new FileReader to read the blob data
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
          // Store the image data (as ArrayBuffer) in the sighting.image property
          sighting.image = fileReader.result;

          // Add sighting to IndexedDB
          putSighting(sighting)
            .then(() => {
              console.log("Sighting put successfully in indexedDB!");

              if (sighting._id) {
                const id = sighting._id;
                // Redirect to the details page
                window.location.href = `/details?id=${id}`;
              }
            })
            .catch((error) => {
              console.log("Error creating sighting");
            });
          console.log("Image downloaded and stored in sighting.image");
        };

        // Start reading the blob data
        fileReader.readAsArrayBuffer(blob);
      })
      .catch((error) => {
        console.log("Error fetching or processing the image file:", error);
      });
  } else if (target.matches("#delete-btn")) {
    const sighting = JSON.parse(target.dataset.sighting);
    if (sighting._id) {
      const id = sighting._id;
      const author = sighting.author;
      deleteSighting(event, id, author);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  /**
   * When the client gets online, it hides the offline warning
   */
  window.addEventListener(
    "online",
    async function (e) {
      // Resync data with the server.
      console.log("You are online from index");

      // Show loading animation
      const loadingElement = document.getElementById("loading-animation");
      loadingElement.style.display = "block";
      // Wait for 2sec
      await new Promise((resolve) => setTimeout(resolve, 2000));
      uploadNewCreateData()
        .then((response) => {
          if (response.ok) {
            console.log("Upload new data success");
          } else {
            console.log("Upload new data error:", response.status);
          }
        })
        .catch((error) => console.log("Upload new data error:", error));
      updateDataMessage()
        .then((response) => {
          if (response.ok) {
            console.log("Update message success");
          } else {
            console.log("Update message error:", response.status);
          }
        })
        .catch((error) => console.log("Update message error:", error))
        .finally(async () => {
          // Hide the loading animation
          loadingElement.style.display = "none";

          // Clean indexedDB
          await clearSightings();

          // Reload the home page
          window.location.href = "http://localhost:3000";
        });
    },
    false
  );
});

// Upload newly created data to the server.
let defaultLocalId = "1";
async function uploadNewCreateData() {
  const sighting = await getSighting(defaultLocalId);
  const formData = new FormData();
  for (const key in sighting) {
    if (key == "messages") {
      formData.append("messages", JSON.stringify(sighting.messages));
    } else {
      formData.append(key, sighting[key]);
    }
  }
  console.log(sighting);

  const response = await fetch("/add", {
    method: "POST",
    body: formData,
  });

  return response;
}

// Message for updating data.
async function updateDataMessage() {
  const sightings = await getAllSightings();
  if (sightings) {
    const response = await fetch("/upload", {
      method: "POST",
      body: JSON.stringify(sightings),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }
}
