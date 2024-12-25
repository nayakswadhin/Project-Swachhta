import { CleanlinessScore } from "../models/cleanlinessScore.model.js";
import { PostOffice } from "../models/postOffice.model.js";
import { ObjectId } from "mongodb";

// Constants
const WEIGHTS = {
  ORGANIC_WASTE: 0.3,
  FREQUENCY: 0.2,
  SIZE: 0.2,
  SWATCH_COMPLIANCE: 0.3
};

const SIZE_FACTORS = {
  small: 1,
  medium: 2,
  large: 3
};

const MAX_FREQUENCY = 200;

export const cleanlinessScore = async (req, res) => {
  try {
    const {
      postOfficeId,
      percentageOrganicWaste,
      swatchComplianceTracker,
      frequency,
      size,
    } = req.body;

    // Input validation with detailed error messages
    if (!postOfficeId) {
      return res.status(400).json({
        success: false,
        message: "Post Office ID is required"
      });
    }

    if (percentageOrganicWaste == null || 
        percentageOrganicWaste < 0 || 
        percentageOrganicWaste > 100) {
      return res.status(400).json({
        success: false,
        message: "Valid percentage of organic waste (0-100) is required"
      });
    }

    if (swatchComplianceTracker == null || 
        swatchComplianceTracker < 0 || 
        swatchComplianceTracker > 100) {
      return res.status(400).json({
        success: false,
        message: "Valid swatch compliance tracker (0-100) is required"
      });
    }

    if (frequency == null || frequency < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid frequency value is required"
      });
    }

    if (!size || !SIZE_FACTORS[size]) {
      return res.status(400).json({
        success: false,
        message: "Valid size (small, medium, large) is required"
      });
    }

    // Check if the post office exists
    const postOffice = await PostOffice.findById(postOfficeId);
    if (!postOffice) {
      return res.status(404).json({
        success: false,
        message: "Post Office not found"
      });
    }

    // Score calculation
    const normalizedFrequency = (1 - Math.min(frequency, MAX_FREQUENCY) / MAX_FREQUENCY) * 100;
    const sizeFactor = SIZE_FACTORS[size];

    const cleanlinessScoreValue = Math.min(100, Math.max(0,
      WEIGHTS.ORGANIC_WASTE * (100 - percentageOrganicWaste) +
      WEIGHTS.FREQUENCY * normalizedFrequency +
      WEIGHTS.SIZE * (100 - sizeFactor * 10) +
      WEIGHTS.SWATCH_COMPLIANCE * swatchComplianceTracker
    ));

    const currentDateTime = new Date();
    const scoreDocument = {
      responseTime: currentDateTime,
      percentageOrganicWaste,
      quantity: { frequency, size },
      swatchComplianceTracker,
      score: cleanlinessScoreValue
    };

    // Update or create cleanliness score
    const existingScore = await CleanlinessScore.findOne({ postOfficeId });
    let cleanlinessScoreRecord;

    if (existingScore) {
      cleanlinessScoreRecord = await CleanlinessScore.findOneAndUpdate(
        { postOfficeId },
        scoreDocument,
        { 
          new: true,
          runValidators: true
        }
      );
    } else {
      cleanlinessScoreRecord = await CleanlinessScore.create({
        postOfficeId,
        ...scoreDocument
      });
    }

    // Update PostOffice score with optimistic concurrency
    const updatedPostOffice = await PostOffice.findOneAndUpdate(
      { 
        _id: postOfficeId,
        version: postOffice.version 
      },
      { 
        $set: { cleanlinessScore: cleanlinessScoreValue },
        $inc: { version: 1 }
      },
      { new: true }
    );

    if (!updatedPostOffice) {
      // Handle concurrent update conflict
      return res.status(409).json({
        success: false,
        message: "Concurrent update detected, please try again"
      });
    }

    return res.status(existingScore ? 200 : 201).json({
      success: true,
      message: existingScore 
        ? "Cleanliness score updated successfully" 
        : "Cleanliness score created successfully",
      data: cleanlinessScoreRecord,
      calculatedScore: cleanlinessScoreValue,
      timestamp: currentDateTime
    });

  } catch (error) {
    console.error("Error in cleanlinessScore:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getCleanlinessScoreId = async (req, res) => {
  try {
    const { postOfficeId, imageUrl } = req.body;

    // Input validation
    if (!postOfficeId) {
      return res.status(400).json({
        success: false,
        message: "Post Office ID is required"
      });
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required"
      });
    }

    // Check if the post office exists
    const postOffice = await PostOffice.findById(postOfficeId);
    if (!postOffice) {
      return res.status(404).json({
        success: false,
        message: "Post Office not found"
      });
    }

    // Find the cleanliness score record
    const cleanlinessScore = await CleanlinessScore.findOne({ postOfficeId });
    if (!cleanlinessScore) {
      return res.status(404).json({
        success: false,
        message: "Cleanliness score not found for this post office"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        cleanlinessScoreId: cleanlinessScore._id,
        imageUrl
      }
    });

  } catch (error) {
    console.error("Error in getCleanlinessScoreId:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};