var express = require("express");
var router = express.Router();
const sighting_controller = require("../controllers/sighting");

router.get("/details", async function (req, res) {
  try {
    const id = req.query.id;
    // Obtain the observation record for the specified ID.
    const sighting = await sighting_controller.getSightingById(id);
    res.render("details", { sighting: sighting });
  } catch (err) {
    // handle error
    res.status(500).send("Internal server error");
  }
});

router.put("/details", async function (req, res) {
  const id = req.query.id;
  const identification = {
    birdName: req.body.birdName,
    description: req.body.description,
    url: req.body.url,
  };

  try {
    // Update based on the given ID and identification information
    const updatedSighting = await sighting_controller.updateIdentification(
      id,
      identification
    );
    res.json(updatedSighting);
    console.log("Updated");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
