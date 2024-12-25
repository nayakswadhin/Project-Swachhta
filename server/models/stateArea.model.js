import mongoose from "mongoose";

const stateArea = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  regionalOffices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegionalOffice",
    },
  ],
  stateOffice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StateOffice",
    default: null,
  },
});

export const stateAreaModel = mongoose.model("stateAreaModel", stateArea);
