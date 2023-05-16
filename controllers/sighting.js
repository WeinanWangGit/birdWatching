const Sighting = require("../models/sighting");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    var original = file.originalname;
    var file_extension = original.split(".");
    // Make the file name the date + the file extension
    filename = Date.now() + "." + file_extension[file_extension.length - 1];
    cb(null, filename);
  },
});

var upload = multer({ storage: storage });

// Insert a new observation record.
function insertSighting(req, res) {
  const sighting = new Sighting({
    description: req.body.description,
    date: req.body.date,
    author: req.body.author,
    location: req.body.location ?? "unknown",
    position: req.body.position ?? "unknown",
    distance: req.body.distance ?? "unknown",
    messages: req.body.messages ? JSON.parse(req.body.messages) : [],
    identification: {
      birdName: req.body.birdName ?? "",
      description: req.body.birdDescription ?? "",
      url: req.body.url ?? "",
    },
    // image: req.file.path,
    image: req.file.path.replace(/\\/g, "\\\\"),
  });

  // console.log(sighting.messages);
  // Save to database.
  sighting.save((err, savedSighting) => {
    if (err) {
      console.error(err);
      res.status(500).send(err.message);
    } else {
      res.status(201).json(savedSighting);
    }
  });
}

// Update the message list in the observation record.
// Find the corresponding observation record based on the given sightingId.
// If found, update its message list to the incoming messages.
function updateMessageList(sightingId, messages) {
  Sighting.findById(sightingId, (err, sighting) => {
    if (err) {
      console.error("Error finding sighting:", err);
      return;
    }
    if (!sighting) {
      console.error("Sighting not found");
      return;
    }

    if (messages.length > sighting.messages.length) {
      sighting.messages = messages;
      sighting.save((err) => {
        if (err) {
          console.error("Error saving sighting:", err);
          return;
        }
        console.log("Sighting message updated successfully");
      });
    }
  });
}

// Batch upload of offline observation records messages.
function uploadOfflineSighting(req, res) {
  const sightings = req.body;
  const defaultId = "1";

  try {
    sightings.forEach((sighting) => {
      const sightingId = sighting._id;
      const messages = sighting.messages;
      if (sightingId !== defaultId) {
        // Call the updateMessageList to update.
        updateMessageList(sightingId, messages);
      }
    });
    res.status(200).send("Sightings message uploaded successfully.");
  } catch (e) {
    res.status(500).send("Sightings message uploaded fail");
  }
}

// Update the messages in the observation record.
function updateSighting(sightingId, message) {
  Sighting.findById(sightingId, (err, sighting) => {
    if (err) {
      console.error("Error finding sighting:", err);
      return;
    }
    if (!sighting) {
      console.error("Sighting not found");
      return;
    }
    // Add to the message list of observation records.
    sighting.messages.push({ text: message, sentAt: new Date() });
    sighting.save((err, updatedSighting) => {
      if (err) {
        console.error("Error saving sighting:", err);
        return;
      }
      console.log("Sighting updated successfully:", updatedSighting);
    });
  });
}

// Obtain a list of observation records.
async function getSightingList(req, res) {
  try {
    // Sort by date in ascending order.
    const sightings = await Sighting.find().sort({ date: "asc" });
    return sightings;
  } catch (err) {
    throw err;
  }
}

// Obtain a single observation record based on the ID of the observation record.
async function getSightingById(id) {
  try {
    const sighting = await Sighting.findById(id);
    return sighting;
  } catch (err) {
    console.error(`Error getting sighting by ID: ${err}`);
    throw err;
  }
}

// Delete observation records.
async function deleteSighting(id) {
  if (!id) {
    throw new Error("Missing sighting ID");
  }
  try {
    await Sighting.deleteOne({ _id: id });
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Update bird identification information from observation records.
async function updateIdentification(id, identification) {
  try {
    const updatedSighting = await Sighting.updateOne(
      { _id: id },
      { $set: { identification: identification } }
    );
    return updatedSighting;
  } catch (err) {
    console.error(`Error updating sighting: ${err}`);
    throw err;
  }
}

module.exports = {
  insertSighting,
  getSightingList,
  getSightingById,
  deleteSighting,
  updateIdentification,
  updateSighting,
  upload,
  uploadOfflineSighting,
};
