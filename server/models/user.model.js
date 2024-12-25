import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    default: "",
  },
  postOffice: {
    type: String,
    default: "",
  },
  phoneno: {
    type: Number,
    required: true,
  },
  latitude: {
    type: String,
    default: "0",
  },
  longitude: {
    type: String,
    default: "0",
  },
});

export const User = mongoose.model("User", userSchema);
