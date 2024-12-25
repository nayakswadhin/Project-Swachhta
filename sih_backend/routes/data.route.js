import express from "express";
import { getData } from "../controller/data.controller.js";

const dataRoute = express.Router();
dataRoute.get("/data", getData);

export default dataRoute;
