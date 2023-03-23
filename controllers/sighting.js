const Sighting = require('../models/sighting');
const multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        var original = file.originalname;
        var file_extension = original.split(".");
        // Make the file name the date + the file extension
        filename = Date.now() + '.' + file_extension[file_extension.length-1];
        cb(null, filename);
    }
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
            url: req.body.url
        },
        image: req.file.path
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

module.exports = {
    insertSighting,
    upload
};
