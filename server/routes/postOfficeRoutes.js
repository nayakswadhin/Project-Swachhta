import express from "express";
import { postOfficeController } from "../controller/postOfficeController.js";

const router = express.Router();

// Get all post offices
router.get("/", postOfficeController.getAllPostOffices);

// Get specific post office
router.get("/:id", postOfficeController.getPostOfficeById);

// Create new post office
router.post("/", postOfficeController.createPostOffice);

router.post("/name", postOfficeController.getPostOfficeByName);

router.post(
  "/:id/update-green-credits",
  postOfficeController.updateGreenCredits
);

router.post("/rankings", postOfficeController.getRankings);

export default router;
