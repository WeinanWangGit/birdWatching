const mongoose = require('mongoose');

const SightingSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    identification: {
        birdName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        url: {
            type: String
        }
    },
    image: {
        type: Buffer
    }
});

module.exports = mongoose.model('Sighting', SightingSchema);
