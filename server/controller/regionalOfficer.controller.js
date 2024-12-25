import { RegionalOffice } from "../models/region.model.js";
import { regionalAreaModel } from "../models/regionalArea.model.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { roCode, name, location, contact, officerInCharge } = req.body;

    // Check existing Regional Office
    const existingRO = await RegionalOffice.findOne({ roCode });
    if (existingRO) {
      return res
        .status(400)
        .json({ message: "Regional Office with this code already exists" });
    }

    // Check existing officer
    const existingOfficer = await RegionalOffice.findOne({
      "officerInCharge.email": officerInCharge.email,
    });
    if (existingOfficer) {
      return res
        .status(400)
        .json({ message: "Officer with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(officerInCharge.password, salt);

    // Find or create regional area
    let regionalArea = await regionalAreaModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (!regionalArea) {
      regionalArea = new regionalAreaModel({
        name,
        divisonalOffices: [],
        regionalOffice: null,
      });
      await regionalArea.save();
    }

    // Get divisional offices from regional area
    const divisionalOffices = regionalArea.divisonalOffices || [];

    // Create new Regional Office
    const newRO = new RegionalOffice({
      roCode,
      name,
      location,
      contact,
      officerInCharge: {
        ...officerInCharge,
        password: hashedPassword,
      },
      divisionalOffices,
    });

    await newRO.save();

    // Update regional area with the new regional office
    regionalArea.regionalOffice = newRO._id;
    await regionalArea.save();

    // Generate token
    const token = generateToken({
      id: newRO._id,
      email: officerInCharge.email,
      role: "regional_officer",
    });

    // Get populated RO data
    const populatedRO = await RegionalOffice.findById(newRO._id).populate(
      "divisionalOffices"
    );

    // Remove password from response
    const response = populatedRO.toObject();
    delete response.officerInCharge.password;

    res.status(201).json({
      regional_officer: response,
      token,
      message:
        divisionalOffices.length > 0
          ? `Registered successfully with ${divisionalOffices.length} associated divisional offices`
          : "Registered successfully without divisional offices",
    });
  } catch (error) {
    console.error("RO Registration Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const regionalOffice = await RegionalOffice.findOne({
      "officerInCharge.email": email,
    }).populate("divisionalOffices");

    if (!regionalOffice) {
      return res.status(404).json({ message: "Regional Officer not found" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      regionalOffice.officerInCharge.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken({
      id: regionalOffice._id,
      email: regionalOffice.officerInCharge.email,
      role: "regional_officer",
    });

    const response = regionalOffice.toObject();
    delete response.officerInCharge.password;

    res.json({
      regional_officer: response,
      token,
    });
  } catch (error) {
    console.error("RO Login Error:", error);
    res.status(500).json({ message: "Internal server error during login" });
  }
};

export const getAllData = async (req, res) => {
  try {
    const regionalOffice = await regionalAreaModel.find({
      regionalOffice: req.params.doId,
    });

    if (!regionalOffice) {
      return res.status(404).json({ message: "Regional Office not found" });
    }
    res.json(regionalOffice.divisonalOffices);
  } catch (error) {
    console.error("Get Regional Offices Error:", error);
    res.status(500).json({ message: "Error fetching post offices" });
  }
};

export const getAllDataById = async (req, res) => {
  try {
    const { regionalOfficeId } = req.body;

    // Find the Regional Area(s) with the specified Regional Office
    const regionalAreas = await regionalAreaModel
      .find({
        regionalOffice: regionalOfficeId,
      })
      .populate({
        path: "divisonalOffices",
        // Optional: specify which fields you want to include from DivisionalOffice
        select: "doCode name location contact officerInCharge.name",
      });

    // Collect all Divisional Offices from the found Regional Areas
    const divisionalOffices = regionalAreas.flatMap(
      (area) => area.divisonalOffices
    );
    if (divisionalOffices.length === 0) {
      return res.status(404).json({
        message: "No Divisional Offices found for this Regional Office",
      });
    }

    res.status(200).json({
      count: divisionalOffices.length,
      divisionalOffices: divisionalOffices,
    });
  } catch (error) {
    console.error("Error fetching Divisional Offices:", error);
    res.status(500).json({
      message: "Internal server error while fetching Divisional Offices",
    });
  }
};

async function getAverageScore(regionalOfficeId) {
  try {
    // Find all divisional offices belonging to this regional office
    const divisionalOffices = await DivisionalOffice.find({
      regionalOffice: regionalOfficeId,
    });

    // If no divisional offices, return early
    if (divisionalOffices.length === 0) {
      return null;
    }

    // Calculate averages
    const averageScores = {
      cleanlinessScore: calculateAverage(divisionalOffices, "cleanlinessScore"),
      wasteManagementScore: calculateAverage(
        divisionalOffices,
        "wasteManagementScore"
      ),
      lifeScore: calculateAverage(divisionalOffices, "lifeScore"),
      energyScore: calculateAverage(divisionalOffices, "energyScore"),
    };

    // Update the regional office with new averages
    const updatedRegionalOffice = await RegionalOffice.findByIdAndUpdate(
      regionalOfficeId,
      averageScores,
      { new: true } // Return the updated document
    );

    return updatedRegionalOffice;
  } catch (error) {
    console.error("Error updating regional office scores:", error);
    throw error;
  }
}

// Helper function to calculate average
function calculateAverage(offices, scoreField) {
  const validScores = offices
    .map((office) => office[scoreField])
    .filter((score) => score !== undefined && score !== null);

  if (validScores.length === 0) return null;

  return (
    validScores.reduce((sum, score) => sum + score, 0) / validScores.length
  );
}

// Example usage in a route or controller
async function handleRegionalOfficeScoreUpdate(req, res) {
  try {
    const { regionalOfficeId } = req.body;

    const updatedOffice = await updateRegionalOfficeScores(regionalOfficeId);

    if (!updatedOffice) {
      return res.status(404).json({ message: "No divisional offices found" });
    }

    res.json(updatedOffice);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating scores", error: error.message });
  }
}

export { getAverageScore, handleRegionalOfficeScoreUpdate };
