import mongoose from "mongoose";

const feedBackSchema = new mongoose.Schema({
  cleanlinessRating: {
    type: Number,
    default: 0,
    required: true,
  },
  wasteManagementRating: {
    type: Number,
    default: 0,
    required: true,
  },
  energyConservation: {
    type: Number,
    default: 0,
    required: true,
  },
  greenPraticies: {
    type: Number,
    required: true,
    default: 0,
  },
  comment: {
    type: String,
    default: "",
  },
});

const feedBackModel = mongoose.model("feedBackSchema", feedBackSchema);

export default feedBackModel;
