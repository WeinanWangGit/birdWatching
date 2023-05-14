var latitude = null;
var longitude = null;
if (navigator.geolocation) {
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

// Initialize Map
function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 53.381766908539895, lng: -1.4816093444824219 },
    zoom: 12,
  });

  var marker = null;

  map.addListener("click", function (e) {
    var location = e.latLng;
    var locationInput = document.getElementById("location");
    locationInput.value = location.lat() + "," + location.lng();

    // Delete the previous marker
    if (marker !== null) {
      marker.setMap(null);
    }
    var myLatlng = new google.maps.LatLng(location.lat(), location.lng());
    marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
    });

    const distance = getDistanceFromLatLonInKm(
      location.lat(),
      location.lng(),
      latitude,
      longitude
    );
    const distance_format = distance.toFixed(2);
    var DistanceInput = document.getElementById("distance");
    DistanceInput.value = distance.toFixed(2) + "km";

    getAddressFromLatLng(location.lat(), location.lng())
      .then(function (address) {
        var PositionInput = document.getElementById("position");
        PositionInput.value = address;
        // Do something with the address string, such as display it on the page
      })
      .catch(function (error) {
        console.log("Error getting address: " + error);
      });
  });
}

// compute distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; //Radius of the Earth (in kilometres)
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance (in kilometres)
  return distance;
}

// Convert angles to radians.
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Obtain the corresponding address information through the given latitude and longitude.
function getAddressFromLatLng(lat, lng) {
  return new Promise(function (resolve, reject) {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ latLng: latlng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          var address = results[0].formatted_address;
          resolve(address);
        } else {
          reject("No results found");
        }
      } else {
        reject("Geocoder failed due to: " + status);
      }
    });
  });
}

// To avoid uncaught syntax error for JSON.stringify
function sanitiseText(text) {
  return text.replace(/['"]/g, "").trim();
}
