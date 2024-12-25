import mongoose from "mongoose";

const overallScore = new mongoose.Schema({
  postOfficeId: {
    type: String,
    required: true,
  },
  CleanlinessScore: {
    type: String,
    required: true,
    unique: true,
  },
  LiFEScore: {
    type: String,
    required: true,
    unique: true,
  },
  greenScore: {
    type: String,
    required: true,
  },
  energyEfficiency: {
    type: String,
    default: "",
  },
  wasteManagement: {
    type: String,
    default: "",
  },
  score: {
    type: Number,
    required: true,
  },
});

export const OverallScoreModel = mongoose.model(
  "OverallScoreModel",
  overallScore
);
