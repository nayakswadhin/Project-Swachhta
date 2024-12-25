import express from "express";
import { health, signin, signup } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { getGemini } from "../controller/gemini.controller.js";

const geminiRoute = express.Router();
geminiRoute.get("/", getGemini);

export default geminiRoute;
