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

    // Add sighting to IndexedDB
    putSighting(sighting)
      .then(() => {
        console.log("Sighting created successfully in indexedDB!");
      })
      .catch((error) => {
        console.log("Error creating sighting");
      });

    if (sighting._id) {
      const id = sighting._id;
      // Redirect to the details page
      window.location.href = `/details?id=${id}`;
    }
  } else if (target.matches("#delete-btn")) {
    const sighting = JSON.parse(target.dataset.sighting);
    if (sighting._id) {
      const id = sighting._id;
      // call deleteSighting function
      deleteSighting(event, id);
      console.log(id);
    }
  }
});

// const elements = document.querySelectorAll(".card, #details-btn");

// // Add the click event listener to each element
// elements.forEach((element) => {
//   element.addEventListener("click", (event) => {
//     // Get the sighting data from the clicked element
//     const sighting = JSON.parse(element.dataset.sighting);

//     // Add sighting to IndexedDB
//     putSighting(sighting)
//       .then(() => {
//         console.log("Sighting created successfully in indexedDB!");
//       })
//       .catch((error) => {
//         console.log("Error creating sighting");
//       });

//     if (sighting._id) {
//       const id = sighting._id;
//       // Redirect to the details page
//       window.location.href = `/details?id=${id}`;
//     }
//   });
// });

// // Get delete button and add eventListener
// document.addEventListener("DOMContentLoaded", () => {
//   const deleteBtn = document.querySelector("#delete-btn");
//   deleteBtn.addEventListener("click", (event) => {
//     const sighting = JSON.parse(deleteBtn.dataset.sighting);
//     if (sighting._id) {
//       const id = sighting._id;
//       // call deleteSighting func
//       deleteSighting(event, id);
//       console.log(id);
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  /**
   * When the client gets online, it hides the offline warning
   */
  window.addEventListener(
    "online",
    async function (e) {
      // Resync data with the server.
      console.log("You are online from index");

      // uploadNewCreateData()
      //   .then((response) => console.log("Upload new data:" + response.status))
      //   .catch((error) => console.log("Upload new data error:", error));

      updateDataMessage()
          .then(() => console.log("Update message success"))
          .catch(error => console.log("Update message error:", error));

      // Clean indexedDB
      // await clearSightings();
    },
    false
  );
});

let defaultLocalId = "1";
async function uploadNewCreateData() {
  const sighting = await getSighting(defaultLocalId);
  const formData = new FormData();
  for (const key in sighting) {
    formData.append(key, sighting[key]);
  }
  console.log(sighting);

  const response = await fetch("/add", {
    method: "POST",
    body: formData,
  });
  return response;
}

async function updateDataMessage() {
  const sightings = await getAllSightings();
  if(sightings){
    let formDataArray = [];
    let formData;

    sightings.forEach((sighting) => {
      formData = new FormData();

      formData.append("_id", sighting._id);
      sighting.messages.forEach((message) => {
        formData.append("messages", message);
      });

      formDataArray.push(formData);
      console.log(formData.get("_id"),  formData.get("messages"))
    });

    console.log(formDataArray)

    const response = await fetch("/upload", {
      method: "POST",
      body: JSON.stringify(formDataArray),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }

}


// function showOfflineWarning() {
//   if (document.getElementById('offline_div') != null)
//     document.getElementById('offline_div').style.display = 'block';
// }
//
// function hideOfflineWarning() {
//   if (document.getElementById('offline_div') != null)
//     document.getElementById('offline_div').style.display = 'none';
// }
