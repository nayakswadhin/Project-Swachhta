import express from "express";
import { cleanlinessScore,getCleanlinessScoreId } from "../controller/cleanlinessScore.controller.js";

const cleanlinessRoute = express.Router();

cleanlinessRoute.post("/score", cleanlinessScore);
cleanlinessRoute.post("/score/id", getCleanlinessScoreId);

export default cleanlinessRoute;
