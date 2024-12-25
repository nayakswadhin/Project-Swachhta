import mongoose from "mongoose";

const cleanlinessScoreSchema = new mongoose.Schema({
  postOfficeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostOffice",
    required: true,
  },
  responseTime: {
    type: Number, // Changed to Number to store milliseconds
    default: Date.now() // Set default to current timestamp
  },
  percentageOrganicWaste: {
    type: Number,
    required: true,
  },
  quantity: {
    frequency: {
      plastic: {
        type: Number,
        min: 0,
      },
      biodegradable: {
        type: Number,
        min: 0,
      },
      metal: {
        type: Number,
        min: 0,
      },
      paper: {
        type: Number,
        min: 0,
      },
      cardboard: {
        type: Number,
        min: 0,
      },
      glass: {
        type: Number,
        min: 0,
      },
    },
    size: {
      type: String,
      required: true,
    },
    totalCount: {
      type: Number,
      required: true,
    },
  },
  imageUrl: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  time: {
    type: Date,
    required: true,
  },
  spit: {
    type: Number,
    default: 0,
  },
  dump: {
    type: Number,
    default: 0,
  },
  Area: {
    type: String,
    default: "Lawns",
  },
}, {
  timestamps: true
});

export const CleanlinessScore = mongoose.model(
  "CleanlinessScore",
  cleanlinessScoreSchema
);
