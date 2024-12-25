import mongoose from "mongoose";

const centralArea = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  stateOffices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StateOffice",
    },
  ],
  centralOffice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CentralOffice",
    default: null,
  },
});

export const centralAreaModel = mongoose.model("centralAreaModel", centralArea);
