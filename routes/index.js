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

/**
 * @swagger
 * deleteSighting
 */
router.post("/delete", async function (req, res) {
  const id = req.query.id;
  try {
    const result = await sighting_controller.deleteSighting(id);
    if (result === true) {
      res.redirect("/");
    } else {
      throw new Error("Failed to delete sighting");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

/* go to create page. */
router.get("/create", function (req, res, next) {
  res.render("create");
});

module.exports = router;
