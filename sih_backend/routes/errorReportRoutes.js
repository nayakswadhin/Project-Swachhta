import express from "express";
import {
  createErrorReport,
  getErrorReports,
  getErrorReportById,
  updateErrorReportStatus,
  getErrorReportsByOfficeId,
} from "../controller/errorReportController.js";

const router = express.Router();

// Create a new error report
router.post("/error-reports", createErrorReport);

// Get all error reports
router.get("/error-reports", getErrorReports);

// Get error report by ID
router.get("/error-reports/:id", getErrorReportById);

// Update error report status
router.patch("/error-reports/:id/status", updateErrorReportStatus);

router.post("/errorpostOffice", getErrorReportsByOfficeId);

export { router as errorReportRoute };
