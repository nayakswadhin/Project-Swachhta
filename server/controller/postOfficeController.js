import { PostOffice } from "../models/postOffice.model.js";

export const postOfficeController = {
  getRankings: async (req, res) => {
    try {
      const { postOfficeId } = req.body; // Access raw param value

      // Validate postOfficeId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(postOfficeId)) {
        return res
          .status(400)
          .json({ message: "Invalid post office ID format" });
      }

      // Get total number of post offices
      const totalPostOffices = await PostOffice.countDocuments();

      // Get current post office
      const currentPostOffice = await PostOffice.findById(postOfficeId);
      if (!currentPostOffice) {
        return res.status(404).json({ message: "Post office not found" });
      }

      // Get rankings for each metric
      const cleanlinessRank =
        (await PostOffice.countDocuments({
          cleanlinessScore: { $gt: currentPostOffice.cleanlinessScore },
        })) + 1;

      const lifeScoreRank =
        (await PostOffice.countDocuments({
          lifeScore: { $gt: currentPostOffice.lifeScore },
        })) + 1;

      const energyScoreRank =
        (await PostOffice.countDocuments({
          energyScore: { $gt: currentPostOffice.energyScore },
        })) + 1;

      const wasteManagementRank =
        (await PostOffice.countDocuments({
          wasteManagementScore: { $gt: currentPostOffice.wasteManagementScore },
        })) + 1;

      // For green score, we need to handle the enum values
      const greenScoreValues = ["poor", "average", "good", "excellent"];
      const currentGreenScoreIndex = greenScoreValues.indexOf(
        currentPostOffice.greenScore
      );

      const greenScoreRank =
        (await PostOffice.countDocuments({
          greenScore: {
            $in: greenScoreValues.slice(currentGreenScoreIndex + 1),
          },
        })) + 1;

      res.json({
        cleanlinessRank,
        lifeScoreRank,
        greenScoreRank,
        energyScoreRank,
        wasteManagementRank,
        totalPostOffices,
      });
    } catch (error) {
      console.error("Error fetching rankings:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch rankings", error: error.message });
    }
  },

  updateGreenCredits: async (req, res) => {
    try {
      // Get the post office ID from the URL parameters
      const postOfficeId = req.params.id;

      // Find the post office and update its green credits
      // '$inc' means increment - it will add 5 to the existing value
      // {new: true} means return the updated document
      const updatedPostOffice = await PostOffice.findByIdAndUpdate(
        postOfficeId,
        {
          $inc: { greenCredits: 5 }, // Add 5 to current greenCredits
        },
        { new: true } // Return the updated document instead of the old one
      );

      // If no post office was found with that ID
      if (!updatedPostOffice) {
        return res.status(404).json({
          message: "Post office not found",
        });
      }

      // If update was successful, send back success response
      res.status(200).json({
        message: "Green credits updated successfully",
        postOffice: updatedPostOffice,
      });
    } catch (error) {
      // If anything goes wrong, log the error and send error response
      console.error("Error updating green credits:", error);
      res.status(500).json({
        message: "Failed to update green credits",
        error: error.message,
      });
    }
  },
  // Get all post offices
  getPostOfficeByName: async (req, res) => {
    try {
      const { name } = req.body;
      const pO = await PostOffice.findOne({ name });

      if (!pO) {
        return res.status(404).json({ message: "Error in fetching" });
      }

      return res.status(200).json({ message: "Got the postOffice", pO });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error in fetching data", error });
    }
  },
  getAllPostOffices: async (req, res) => {
    try {
      const postOffices = await PostOffice.find()
        .populate("areaId", "name")
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: postOffices,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching post offices",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },

  // Get post office by ID
  getPostOfficeById: async (req, res) => {
    try {
      const postOffice = await PostOffice.findById(req.params.id)
        .populate("areaId", "name")
        .populate("userId", "name email");

      if (!postOffice) {
        return res.status(404).json({
          success: false,
          message: "Post office not found",
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

  // Create new post office
  createPostOffice: async (req, res) => {
    try {
      const newPostOffice = await PostOffice.create(req.body);

      const populatedPostOffice = await PostOffice.findById(newPostOffice._id)
        .populate("areaId", "name")
        .populate("userId", "name email");

      res.status(201).json({
        success: true,
        data: populatedPostOffice,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error creating post office",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },
};
