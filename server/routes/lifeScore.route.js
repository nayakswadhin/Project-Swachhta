import express from "express";
import { getLifeScoreById } from "../controller/life.controller.js";

const lifeRoute = express.Router();
lifeRoute.post("/lifescore", getLifeScoreById);

export default lifeRoute;
