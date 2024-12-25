import express from "express";
import { health, signin, signup } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const userRoute = express.Router();
userRoute.post("/signup",signup);
userRoute.post("/signin",signin);
userRoute.get("/health", health);

export default userRoute;
