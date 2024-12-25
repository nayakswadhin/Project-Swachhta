import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  postOfficeId: {
    type: String,
    required: true,
  },
  location: {
    area: {
      type: String,
      default: "",
    },
    postOffice: {
      type: String,
      default: "",
    },
  },
  timestamp: {
    type: String,
    required: true,
    unique: true,
  },
  typeOfWaste: {
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
  sizeOfWaste: {
    type: Number,
    default: "",
  },
  photolink: {
    type: String,
    default: "",
  },
});

export const DataModel = mongoose.model("DataModel", dataSchema);
