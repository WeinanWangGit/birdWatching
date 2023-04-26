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

function insertSighting(req, res) {
  const sighting = new Sighting({
    description: req.body.description,
    date: req.body.date,
    author: req.body.author,
    location: req.body.location,
    identification: {
      birdName: req.body.birdName,
      description: req.body.birdDescription,
      url: req.body.url,
    },
    image: req.file.path,
  });

  console.log(sighting);

  sighting.save((err, savedSighting) => {
    if (err) {
      console.error(err);
      res.status(500).send(err.message);
    } else {
      res.status(201).json(savedSighting);
    }
  });
}

// NOT IN USE
// function updateSighting(sightingTemp) {
//     Sighting.findById(sightingTemp._id, (err, sighting) => {
//         if (err) {
//             console.error(err);
//         } else {
//             sighting.messages.push(sightingTemp.messages[sightingTemp.messages.length - 1]);
//             sighting.save((err, updatedSighting) => {
//                 if (err) {
//                     console.error(err);
//                 } else {
//                     console.log('Sighting updated successfully:', updatedSighting);
//                 }
//             });
//         }
//     });
// }

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

async function getSightingList(req, res) {
  try {
    const sightings = await Sighting.find().sort({ date: "asc" });
    return sightings;
  } catch (err) {
    throw err;
  }
}

async function getSightingById(id) {
  try {
    const sighting = await Sighting.findById(id);
    return sighting;
  } catch (err) {
    console.error(`Error getting sighting by ID: ${err}`);
    throw err;
  }
}

// NOT IN USE
// async function getSightingByIdAndUpdate(id, identification) {
//   try {
//     const updatedSighting = await Sighting.findByIdAndUpdate(
//       id,
//       {
//         $set: { identification: identification },
//       },
//       { new: true }
//     );
//     return updatedSighting;
//   } catch (err) {
//     console.error(`Error getting sighting by ID: ${err}`);
//     throw err;
//   }
// }

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
  // getSightingByIdAndUpdate,
  updateIdentification,
  updateSighting,
  upload,
};
