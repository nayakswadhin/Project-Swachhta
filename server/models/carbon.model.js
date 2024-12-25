import mongoose from "mongoose";

const carbonSchema = new mongoose.Schema({
  postOfficeId: {
    type: String,
    required: true,
  },
  Area: {
    type: String,
    default: "Lawns",
  },
  car: {
    type: Number,
    default: 0,
  },
  motorCycle: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: Number,
    default: 0,
  },
  time: {
    type: Date,
    required: true,
  },
});

export const carbonModel = mongoose.model("carbonModel", carbonSchema);
