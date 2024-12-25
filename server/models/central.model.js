import mongoose from "mongoose";

const centralOfficeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    location: {
      address: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      pincode: {
        type: String,
        default: "",
      },
    },
    contact: {
      email: String,
      phone: String,
    },
    officerInCharge: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    stateOffices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegionalOffice",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const CentralOffice = mongoose.model(
  "CentralOffice",
  centralOfficeSchema
);
