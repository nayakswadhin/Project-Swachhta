import mongoose from "mongoose";

const regionalOfficeSchema = new mongoose.Schema(
  {
    roCode: {
      type: String,
      default: "666",
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      region: {
        type: String,
        default: "South",
      },
      state: {
        type: String,
        default: "Odisha",
      },
      pincode: {
        type: String,
        default: "754120",
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
    divisionalOffices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DivisionalOffice",
      },
    ],
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
  },
  {
    timestamps: true,
  }
);

export const RegionalOffice = mongoose.model(
  "RegionalOffice",
  regionalOfficeSchema
);
