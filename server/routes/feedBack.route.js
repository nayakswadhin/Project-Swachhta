import express from "express";
import { feedBack } from "../controller/feedback.controller.js";

const feedBackRoute = express.Router();
feedBackRoute.post("/", feedBack);

export default feedBackRoute;
