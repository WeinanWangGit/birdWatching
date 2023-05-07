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
