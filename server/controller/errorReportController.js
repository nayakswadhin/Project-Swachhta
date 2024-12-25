import ErrorReport from "../models/ErrorReport.js";
import mongoose from "mongoose";

// Create a new error report
export const createErrorReport = async (req, res) => {
  try {
    const {
      postOfficeId,
      detectionType,
      errorCategory,
      severity,
      additionalNotes,
      alertImage,
    } = req.body;

    // Create new error report with validated ObjectId
    const errorReport = new ErrorReport({
      postOfficeId: new mongoose.Types.ObjectId(postOfficeId),
      detectionType,
      errorCategory,
      severity,
      additionalNotes,
      alertImage,
      timestamp: new Date(),
    });

    // Save the error report
    const savedReport = await errorReport.save();

    res.status(201).json({
      success: true,
      message: "Error report created successfully",
      data: savedReport,
    });
  } catch (error) {
    console.error("Error creating error report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create error report",
      error: error.message,
    });
  }
};

// Get all error reports
export const getErrorReports = async (req, res) => {
  try {
    const errorReports = await ErrorReport.find()
      .populate("postOfficeId")
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: errorReports,
    });
  } catch (error) {
    console.error("Error fetching error reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch error reports",
      error: error.message,
    });
  }
};

export const getErrorReportsByOfficeId = async (req, res) => {
  try {
    const { postOfficeId } = req.body;
    const errorReports = await ErrorReport.find({ postOfficeId: postOfficeId });
    console.log(errorReports);
    if (!errorReports) {
      return res.status(400).json({ message: "Not Found", errorReports });
    }
    return res.status(200).json({
      message: "Succesfully got the record",
      postOfficeId: postOfficeId,
      errorReports,
    });
 
  } catch (error) {
    console.log(error);
  }
};

// Get error report by ID
export const getErrorReportById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid error report ID format",
      });
    }

    const errorReport = await ErrorReport.findById(req.params.id).populate(
      "postOfficeId"
    );

    if (!errorReport) {
      return res.status(404).json({
        success: false,
        message: "Error report not found",
      });
    }

    res.status(200).json({
      success: true,
      data: errorReport,
    });
  } catch (error) {
    console.error("Error fetching error report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch error report",
      error: error.message,
    });
  }
};

// Update error report status
export const updateErrorReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid error report ID format",
      });
    }

    const errorReport = await ErrorReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!errorReport) {
      return res.status(404).json({
        success: false,
        message: "Error report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Error report status updated successfully",
      data: errorReport,
    });
  } catch (error) {
    console.error("Error updating error report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update error report",
      error: error.message,
    });
  }
};
