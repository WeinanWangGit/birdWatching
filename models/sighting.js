const mongoose = require("mongoose");

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
    // default: Date.now,
    // get: (v) => v.toDateString(), // convert Date object to string
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
  distance: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  // identification: {
  //   birdName: {
  //     type: String,
  //     required: true,
  //   },
  //   description: {
  //     type: String,
  //     required: true,
  //   },
  //   url: {
  //     type: String,
  //   },
  // },
  identification: {
    type: IdentificationSchema,
    required: true,
  },

  // ORIGINAL
  // image: {
  //   type: Buffer,
  // },

  // TODO
  // image: {
  //   data: { type: Buffer, required: true },
  //   contentType: { type: String, required: true },
  // },

  // IN USE NOW
  image: {
    data: {
      type: Buffer,
      required: function () {
        return !this.image.url;
      },
    },
    url: {
      type: String,
      validate: {
        validator: function (v) {
          return !this.image.data || !v;
        },
        message: "Either data or url must be set for image",
      },
    },
  },

  // messages: {
  //   type: [String], // string array
  //   default: [], // default empty array
  // },

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
