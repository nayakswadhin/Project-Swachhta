import mongoose from "mongoose";

const postOfficeSchema = new mongoose.Schema(
  {
    areaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    cleanlinessScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    lifeScore: {
      type: Number,
      default: 0,
    },
    energyScore: {
      type: Number,
      default: 0,
    },
    wasteManagementScore: {
      type: Number,
      default: 0,
    },
    greenScore: {
      type: String,
      enum: ['poor', 'good', 'excellent', 'average'],
      default: 'average'
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    photoLinks: {
      type: [String],
      default: [],
    },
    latitude: {
      type: String,
      default: "20.265623",
    },
    longitude: {
      type: String,
      default: "85.839722",
    },
    greenCredits: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const PostOffice = mongoose.model("PostOffice", postOfficeSchema);
