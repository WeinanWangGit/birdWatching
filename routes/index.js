var express = require("express");
var router = express.Router();
const sighting_controller = require("../controllers/sighting");

/**
 * @swagger
 * getSightingList
 */
router.get("/", async function (req, res) {
  try {
    const sightings = await sighting_controller.getSightingList();
    res.render("index", { sightings: sightings });
  } catch (err) {
    // handle error
    res.status(500).send("Internal server error");
  }
});



/* go to create page. */
router.get("/create", function (req, res, next) {
  res.render("create");
});

module.exports = router;
