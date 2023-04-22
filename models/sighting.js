const mongoose = require("mongoose");

// Define a Mongoose schema for the bird sighting data
const SightingSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    get: (v) => v.toDateString(), // convert Date object to string
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  identification: {
    birdName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
  },
  image: {
    type: Buffer,
  },
  messages: {
    type: [String], // string array
    default: [], // default empty array
  },
});

module.exports = mongoose.model("Sighting", SightingSchema);
