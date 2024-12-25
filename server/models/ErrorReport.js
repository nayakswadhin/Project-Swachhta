import mongoose from "mongoose";

const errorReportSchema = new mongoose.Schema({
  detectionType: {
    type: String,
    required: true,
    enum: [
      "recyclable",
      "messy",
      "overflow",
      "greenery",
      "bin",
      "vehicle",
      "frequency",
      "spit",
    ],
  },
  errorCategory: {
    type: String,
    required: true,
    enum: [
      "false_positive",
      "false_negative",
      "misclassification",
      "poor_detection",
    ],
  },
  severity: {
    type: String,
    required: true,
    enum: ["low", "medium", "high"],
  },
  additionalNotes: {
    type: String,
    required: false,
  },
  postOfficeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostOffice",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  postOfficeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostOffice",
    required: true,
  },
  alertImage: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "reviewing", "resolved"],
    default: "pending",
  },
});

export default mongoose.model("ErrorReport", errorReportSchema);
