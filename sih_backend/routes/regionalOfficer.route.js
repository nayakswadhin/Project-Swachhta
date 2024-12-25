import express from "express";
import {
  getAllData,
  getAllDataById,
  getAverageScore,
  login,
  register,
} from "../controller/regionalOfficer.controller.js";

const regional = express.Router();

// Public routes
regional.post("/register", register);
regional.post("/login", login);
regional.get("/:id/divisional-offices", getAllData);
regional.post("/getalldata", getAllDataById);
regional.post("/getavg", getAverageScore);

// Protected routes
// router.get('/profile', authMiddleware, divisionalOfficeController.getProfile);
// router.get('/:doId/post-offices', authMiddleware, divisionalOfficeController.getPostOffices);
// router.get('/workers/:doId', authMiddleware, divisionalOfficeController.getWorkers);
// router.get('/details/:doId', authMiddleware, divisionalOfficeController.getDODetails);
// router.put('/update/:doId', authMiddleware, divisionalOfficeController.updateDODetails);
// router.get('/unassigned-post-offices', authMiddleware, divisionalOfficeController.listUnassignedPostOffices);

export default regional;
