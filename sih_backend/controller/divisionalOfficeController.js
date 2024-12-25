import bcrypt from "bcryptjs";
import { DivisionalOffice } from "../models/DivisionalOffice.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import { PostOffice } from "../models/postOffice.model.js";
import { Area } from "../models/area.model.js";
import { regionalAreaModel } from "../models/regionalArea.model.js";

const calculateAverageScore = (postOffices, scoreField) => {
  if (postOffices.length === 0) return 0;

  const totalScore = postOffices.reduce((sum, office) => {
    // Use 0 if the score is undefined or null
    const score = office[scoreField] || 0;
    return sum + score;
  }, 0);

  return Number((totalScore / postOffices.length).toFixed(2));
};

export const divisionalOfficeController = {
  async updateAreaWithPostOffice(area, divisionalOfficeId) {
    area.divisionalOfficer.push(divisionalOfficeId);
    await area.save();

    if (area.divisionalOfficer) {
      await DivisionalOffice.findByIdAndUpdate(
        area.divisionalOfficer,
        { $push: { divisionalOffices: divisionalOfficeId } },
        { new: true }
      );
    }
  },

  async register(req, res) {
    try {
      const { doCode, name, location, contact, officerInCharge } = req.body;

      // Validate required fields
      if (!doCode) {
        return res.status(400).json({
          message: "Missing required fields: doCode are required",
        });
      }
      if (!name) {
        return res.status(400).json({
          message: "Missing required fields: name are required",
        });
      }
      if (!location) {
        return res.status(400).json({
          message: "Missing required fields: location are required",
        });
      }
      if (!officerInCharge) {
        return res.status(400).json({
          message: "Missing required fields: officerInCharge are required",
        });
      }
      if (!contact) {
        return res.status(400).json({
          message: "Missing required fields: contact are required",
        });
      }

      // Validate officer in charge fields
      if (
        !officerInCharge.name ||
        !officerInCharge.email ||
        !officerInCharge.phone ||
        !officerInCharge.password
      ) {
        return res.status(400).json({
          message:
            "Officer in charge must have name, email, phone, and password",
        });
      }

      // Check existing DO
      const existingDO = await DivisionalOffice.findOne({ doCode });
      if (existingDO) {
        return res
          .status(400)
          .json({ message: "Divisional Office with this code already exists" });
      }

      // Check existing officer
      const existingOfficer = await DivisionalOffice.findOne({
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

      // Find area and its post offices by city name (case-insensitive)
      const area = location.city
        ? await Area.findOne({
            name: { $regex: new RegExp(`^${location.city}$`, "i") },
          })
        : null;

      // If area exists, get its post offices
      let postOffices = [];
      if (area) {
        const areaWithPostOffices = await Area.findById(area._id).populate(
          "postOffices"
        );
        postOffices = areaWithPostOffices.postOffices.map((po) => po._id);
      }

      // Create new DO with post offices if area exists
      const newDO = new DivisionalOffice({
        doCode,
        name,
        location,
        contact,
        officerInCharge: {
          ...officerInCharge,
          password: hashedPassword,
        },
        postOffices,
      });

      await newDO.save();

      // Update area with the divisional officer reference
      if (area) {
        area.divisionalOfficer = newDO._id;
        await area.save();
      }

      // Find or create the regional area and add the new Divisional Office
      const regionalArea = await regionalAreaModel.findOne({
        name: location.region,
      });

      if (regionalArea) {
        // If regional area exists, add the new Divisional Office to its divisionalOffices
        if (!regionalArea.divisonalOffices.includes(newDO._id)) {
          regionalArea.divisonalOffices.push(newDO._id);
          await regionalArea.save();
        }
      } else {
        // If regional area doesn't exist, create a new one
        const newRegionalArea = new regionalAreaModel({
          name: location.region,
          divisonalOffices: [newDO._id],
        });
        await newRegionalArea.save();
      }

      if (typeof updateAreaWithPostOffice === "function") {
        updateAreaWithPostOffice(location.region, newDO._id);
      }

      // Update post offices with the new DO reference
      if (postOffices.length > 0) {
        await PostOffice.updateMany(
          { _id: { $in: postOffices } },
          { divisionalOffice: newDO._id }
        );
      }

      // Generate token
      const token = generateToken({
        id: newDO._id,
        email: officerInCharge.email,
        role: "divisional_officer",
      });

      // Get populated DO data
      const populatedDO = await DivisionalOffice.findById(newDO._id).populate(
        "postOffices"
      );

      // Remove password from response
      const response = populatedDO.toObject();
      delete response.officerInCharge.password;

      res.status(201).json({
        do_officer: response,
        token,
        message:
          postOffices.length > 0
            ? `Registered successfully with ${postOffices.length} associated post offices`
            : "Registered successfully without post offices",
      });
    } catch (error) {
      console.error("DO Registration Error:", error);
      res
        .status(500)
        .json({ message: "Internal server error during registration" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const divisionalOffice = await DivisionalOffice.findOne({
        "officerInCharge.email": email,
      }).populate("postOffices");

      if (!divisionalOffice) {
        return res
          .status(404)
          .json({ message: "Divisional Officer not found" });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        divisionalOffice.officerInCharge.password
      );
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = generateToken({
        id: divisionalOffice._id,
        email: divisionalOffice.officerInCharge.email,
        role: "divisional_officer",
      });

      const response = divisionalOffice.toObject();
      delete response.officerInCharge.password;

      res.json({
        do_officer: response,
        token,
      });
    } catch (error) {
      console.error("DO Login Error:", error);
      res.status(500).json({ message: "Internal server error during login" });
    }
  },

  async getProfile(req, res) {
    try {
      const divisionalOffice = await DivisionalOffice.findById(
        req.user.id
      ).populate("postOffices");

      if (!divisionalOffice) {
        return res.status(404).json({ message: "Divisional Office not found" });
      }

      const response = divisionalOffice.toObject();
      delete response.officerInCharge.password;

      res.json({ do_officer: response });
    } catch (error) {
      console.error("Get Profile Error:", error);
      res
        .status(500)
        .json({ message: "Internal server error while fetching profile" });
    }
  },

  async getDODetails(req, res) {
    try {
      const divisionalOffice = await DivisionalOffice.findById(
        req.params.doId
      ).populate("postOffices");

      if (!divisionalOffice) {
        return res.status(404).json({ message: "Divisional Office not found" });
      }

      const response = divisionalOffice.toObject();
      delete response.officerInCharge.password;

      res.json({ do_officer: response });
    } catch (error) {
      console.error("Get DO Details Error:", error);
      res
        .status(500)
        .json({ message: "Error fetching Divisional Office details" });
    }
  },

  async getPostOffices(req, res) {
    try {
      const divisionalOffice = await DivisionalOffice.findById(
        req.params.doId
      ).populate("postOffices");

      if (!divisionalOffice) {
        return res.status(404).json({ message: "Divisional Office not found" });
      }

      res.json(divisionalOffice.postOffices);
    } catch (error) {
      console.error("Get Post Offices Error:", error);
      res.status(500).json({ message: "Error fetching post offices" });
    }
  },

  async getWorkers(req, res) {
    try {
      const divisionalOffice = await DivisionalOffice.findById(
        req.params.doId
      ).populate("postOffices");

      if (!divisionalOffice) {
        return res.status(404).json({ message: "Divisional Office not found" });
      }

      const postOfficeIds = divisionalOffice.postOffices.map((po) => po._id);

      const workers = await User.find({
        postOffice: { $in: postOfficeIds },
      });

      res.json(workers);
    } catch (error) {
      console.error("Get Workers Error:", error);
      res.status(500).json({ message: "Error fetching workers" });
    }
  },

  async updateDODetails(req, res) {
    try {
      const { doId } = req.params;
      const updates = req.body;

      if (updates.officerInCharge?.password) {
        const salt = await bcrypt.genSalt(10);
        updates.officerInCharge.password = await bcrypt.hash(
          updates.officerInCharge.password,
          salt
        );
      }

      const currentDO = await DivisionalOffice.findById(doId);
      if (!currentDO) {
        return res.status(404).json({ message: "Divisional Office not found" });
      }

      if (
        updates.location?.city &&
        updates.location.city !== currentDO.location.city
      ) {
        // Find area and its post offices by new city name
        const area = await Area.findOne({
          name: { $regex: new RegExp(`^${updates.location.city}$`, "i") },
        });

        // If area exists, get its post offices
        if (area) {
          const areaWithPostOffices = await Area.findById(area._id).populate(
            "postOffices"
          );
          updates.postOffices = areaWithPostOffices.postOffices.map(
            (po) => po._id
          );

          // Update post offices with the new DO reference
          await PostOffice.updateMany(
            { _id: { $in: updates.postOffices } },
            { divisionalOffice: doId }
          );
        } else {
          updates.postOffices = [];
        }
      }

      const updatedDO = await DivisionalOffice.findByIdAndUpdate(
        doId,
        updates,
        { new: true }
      ).populate("postOffices");

      const response = updatedDO.toObject();
      delete response.officerInCharge.password;

      res.json({
        do_officer: response,
        message: "Divisional Office updated successfully",
      });
    } catch (error) {
      console.error("Update DO Error:", error);
      res.status(500).json({ message: "Error updating Divisional Office" });
    }
  },

  async listUnassignedPostOffices(req, res) {
    try {
      const unassignedPostOffices = await PostOffice.find({
        divisionalOffice: null,
      });

      res.json(unassignedPostOffices);
    } catch (error) {
      console.error("List Unassigned Post Offices Error:", error);
      res
        .status(500)
        .json({ message: "Error fetching unassigned post offices" });
    }
  },

  getDivisionalOfficeById: async (req, res) => {
    try {
      const postOffice = await PostOffice.findById(req.params.id)
        .populate("areaId", "name")
        .populate("userId", "name email");

      if (!postOffice) {
        return res.status(404).json({
          success: false,
          message: "Divisional office not found",
        });
      }

      res.status(200).json({
        success: true,
        data: postOffice,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching post office",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },

  getAverageCleaninessScore: async (req, res) => {
    try {
      const { divisionalId } = req.body;

      // Find areas associated with the divisional officer
      const areas = await Area.find({
        divisionalOfficer: divisionalId,
      }).populate({
        path: "postOffices",
      });

      // Collect all post offices
      const postOffices = areas.flatMap((area) => area.postOffices);

      if (postOffices.length === 0) {
        return res.status(404).json({
          message: "No Post Offices found for this Divisional Officer",
        });
      }

      // Calculate average scores
      const averageScores = {
        cleanlinessScore: calculateAverageScore(
          postOffices,
          "cleanlinessScore"
        ),
        wasteManagementScore: calculateAverageScore(
          postOffices,
          "wasteManagementScore"
        ),
        lifeScore: calculateAverageScore(postOffices, "lifeScore"),
        energyScore: calculateAverageScore(postOffices, "energyScore"),
      };

      // Update Divisional Office with average scores
      const updatedDivisionalOffice = await DivisionalOffice.findByIdAndUpdate(
        divisionalId,
        {
          cleanlinessScore: averageScores.cleanlinessScore,
          wasteManagementScore: averageScores.wasteManagementScore,
          lifeScore: averageScores.lifeScore,
          energyScore: averageScores.energyScore,
        },
        { new: true } // Return the updated document
      );

      res.status(200).json({
        count: postOffices.length,
        averageScores,
        divisionalOffice: updatedDivisionalOffice,
      });
    } catch (error) {
      console.error("Error calculating average scores:", error);
      res.status(500).json({
        message: "Internal server error while calculating scores",
      });
    }
  },

  // Helper function to calculate average sco
};
