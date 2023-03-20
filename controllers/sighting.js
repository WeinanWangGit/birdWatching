const Sighting = require('../models/sighting');
const multer = require('multer');

// configure multer to store images in memory
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    }
});

function insertSighting(req, res) {
    const sighting = new Sighting({
        description: req.body.description,
        date: req.body.date,
        author: req.body.author,
        location: req.body.location,
        identification: {
            birdName: req.body.birdName,
            description: req.body.identificationDescription,
            url: req.body.identificationUrl
        },
        image: req.file ? req.file.buffer : undefined
    });

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
