import mongoose from "mongoose";

const wasteSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["organic", "plastic"],
    required: true,
  },
  isAccidentProne: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    enum: ["small", "medium", "large"],
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  postOfficeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostOffice",
    required: true,
  },
  photoLink: {
    type: String,
    default: "",
  },
  isRead: {
    type: Boolean,
    default: false,
  }
});

export const Waste = mongoose.model("Waste", wasteSchema);