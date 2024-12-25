import mongoose from "mongoose";

const energyDataSchema = new mongoose.Schema({
  postOfficeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostOffice",
    required: true,
  },
  roomType: {
    type: String,
    enum: ["small", "medium", "large"],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  energyKWh: {
    type: Number,
    required: true,
    min: 0,
  },
  efficiency: {
    type: String,
    enum: ["efficient", "moderate", "inefficient"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const EnergyData = mongoose.model("EnergyData", energyDataSchema);