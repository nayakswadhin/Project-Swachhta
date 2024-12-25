import mongoose from "mongoose";

const stateOfficeSchema = new mongoose.Schema(
  {
    soCode: {
      type: String,
      default: "666",
    },
    name: {
      type: String,
      required: true,
    },
    location: {
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
    regionalOffices: [
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

export const StateOffice = mongoose.model("StateOffice", stateOfficeSchema);
