import mongoose from "mongoose";

const lifeModelSchema = new mongoose.Schema({
  postOfficeId: {
    type: String,
    required: true,
  },
  Area: {
    type: String,
    default: "Lawns",
  },
  amountOfPlastic: {
    type: Number,
    default: 0,
  },
  recyclableCount: {
    type: Number,
    default: 0,
  },
  messyPercentage: {
    type: Number,
    default: 0,
  },
  bins: {
    type: Number,
    default: 0,
  },
  overflow: {
    type: Number,
    default: 0,
  },
  time: {
    type: Date,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    max: 100,
  },
});

const lifeScore = mongoose.model("lifeScore", lifeModelSchema);

export default lifeScore;
