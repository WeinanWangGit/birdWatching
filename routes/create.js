var express = require("express");
var router = express.Router();

const sighting_controller = require("../controllers/sighting");

router.post(
  "/add",
  sighting_controller.upload.single("image"),
  sighting_controller.insertSighting
);


router.post(
    "/upload",
    sighting_controller.uploadOfflineSighting
);

module.exports = router;
