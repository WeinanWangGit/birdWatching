var express = require("express");
var router = express.Router();

const sighting_controller = require("../controllers/sighting");

router.post(
  "/create",
  sighting_controller.upload.single("image"),
  sighting_controller.insertSighting
);

module.exports = router;
