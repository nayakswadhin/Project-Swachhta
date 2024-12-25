import mongoose from "mongoose";

const wasteImageSchema = new mongoose.Schema({
  postOfficeId: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  wasteDetected: {
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
  percentageOfOragic: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

const WasteImage = mongoose.model("WasteImage", wasteImageSchema);

export default WasteImage;
