import { StateOffice } from "../models/state.model.js";
import { stateAreaModel } from "../models/stateArea.model.js";
import { RegionalOffice } from "../models/region.model.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { soCode, name, location, contact, officerInCharge } = req.body;

    // Check existing State Office by code
    const existingSO = await StateOffice.findOne({ soCode });
    if (existingSO) {
      return res.status(400).json({
        message: "State Office with this code already exists",
      });
    }

    // Check if state office already exists for this state
    const existingStateOffice = await StateOffice.findOne({
      "location.state": location.state,
    });
    if (existingStateOffice) {
      return res.status(400).json({
        message: "State Office already exists for this state",
      });
    }

    // Check existing officer
    const existingOfficer = await StateOffice.findOne({
      "officerInCharge.email": officerInCharge.email,
    });
    if (existingOfficer) {
      return res.status(400).json({
        message: "Officer with this email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(officerInCharge.password, salt);

    // Find or create state area
    let stateArea = await stateAreaModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    // Find regional offices in the same state
    const regionalOffices = await RegionalOffice.find({
      "location.state": location.state,
    });
    const regionalOfficeIds = regionalOffices.map((office) => office._id);

    if (!stateArea) {
      stateArea = new stateAreaModel({
        name,
        regionalOffices: regionalOfficeIds,
        stateOffice: null,
      });
      await stateArea.save();
    }

    // Create new State Office
    const newStateOffice = new StateOffice({
      soCode,
      name,
      location,
      contact,
      officerInCharge: {
        ...officerInCharge,
        password: hashedPassword,
      },
      stateOffices: regionalOfficeIds,
    });

    await newStateOffice.save();

    // Update state area with the new state office and regional offices
    stateArea.stateOffice = newStateOffice._id;
    if (regionalOfficeIds.length > 0) {
      stateArea.regionalOffices = regionalOfficeIds;
    }
    await stateArea.save();

    // Generate token
    const token = generateToken({
      id: newStateOffice._id,
      email: officerInCharge.email,
      role: "state_officer",
    });

    // Get populated State Office data
    const populatedStateOffice = await StateOffice.findById(
      newStateOffice._id
    ).populate("stateOffices");

    // Remove password from response
    const response = populatedStateOffice.toObject();
    delete response.officerInCharge.password;

    res.status(201).json({
      state_officer: response,
      token,
      message:
        regionalOfficeIds.length > 0
          ? `Registered successfully with ${regionalOfficeIds.length} associated regional offices`
          : "Registered successfully without regional offices",
    });
  } catch (error) {
    console.error("State Office Registration Error:", error);
    res.status(500).json({
      message: "Internal server error during registration",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const stateOffice = await StateOffice.findOne({
      "officerInCharge.email": email,
    }).populate("stateOffices");

    if (!stateOffice) {
      return res.status(404).json({
        message: "State Officer not found",
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      stateOffice.officerInCharge.password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = generateToken({
      id: stateOffice._id,
      email: stateOffice.officerInCharge.email,
      role: "state_officer",
    });

    const response = stateOffice.toObject();
    delete response.officerInCharge.password;

    res.json({
      state_officer: response,
      token,
    });
  } catch (error) {
    console.error("State Office Login Error:", error);
    res.status(500).json({
      message: "Internal server error during login",
    });
  }
};
