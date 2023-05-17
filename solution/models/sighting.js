const mongoose = require("mongoose");

// Suppress the deprecation warning by setting strictQuery to true
mongoose.set('strictQuery', true);


// Define a shema for Identification
const IdentificationSchema = new mongoose.Schema({
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
});

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
    required: false,
  },
  distance:{
    type: String,
    required: false,
  },
  position:{
    type: String,
    required: false,
  },
  identification: {
    type: IdentificationSchema,
    required: true,
  },
  image: {
    type: String,
  },
  messages: [
    {
      text: {
        type: [String],
        default: [],
      },
      sentAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Sighting", SightingSchema);
