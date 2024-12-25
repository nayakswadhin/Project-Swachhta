import mongoose from "mongoose";

const regionalArea = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  divisonalOffices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DivisionalOffice",
    },
  ],
  regionalOffice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RegionalOffice",
    default: null,
  },
});

export const regionalAreaModel = mongoose.model(
  "regionalAreaModel",
  regionalArea
);
