import express from "express";
import { divisionalOfficeController } from "../controller/divisionalOfficeController.js";
import { authMiddleware } from "../middleware/auth.js";
import { getCleanlinessScoreId } from "../controller/cleanlinessScore.controller.js";

const router = express.Router();

// Public routes
router.post("/register", divisionalOfficeController.register);
router.post("/login", divisionalOfficeController.login);

// Protected routes
router.get("/profile", authMiddleware, divisionalOfficeController.getProfile);
router.get(
  "/:doId/post-offices",
  authMiddleware,
  divisionalOfficeController.getPostOffices
);
router.get(
  "/workers/:doId",
  authMiddleware,
  divisionalOfficeController.getWorkers
);
router.get(
  "/details/:doId",
  authMiddleware,
  divisionalOfficeController.getDODetails
);
router.put(
  "/update/:doId",
  authMiddleware,
  divisionalOfficeController.updateDODetails
);
router.get(
  "/unassigned-post-offices",
  authMiddleware,
  divisionalOfficeController.listUnassignedPostOffices
);

router.get("/:id", divisionalOfficeController.getDivisionalOfficeById);
router.post("/getavg", divisionalOfficeController.getAverageCleaninessScore);

export default router;
