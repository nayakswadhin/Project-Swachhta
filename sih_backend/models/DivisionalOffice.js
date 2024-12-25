import mongoose from "mongoose";

const divisionalOfficeSchema = new mongoose.Schema(
  {
    doCode: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      region: {
        type: String,
        default: "North",
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
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
    cleanlinessScore: {
      type: Number,
      default: 68,
    },

    wasteManagementScore: {
      type: Number,
      default: 78,
    },
    lifeScore: {
      type: Number,
      default: 78,
    },
    energyScore: {
      type: Number,
      default: 78,
    },
    postOffices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostOffice",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const DivisionalOffice = mongoose.model(
  "DivisionalOffice",
  divisionalOfficeSchema
);
