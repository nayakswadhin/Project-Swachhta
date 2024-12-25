import express from "express";
import postOfficeImageController from "../controller/postOfficeImage.controller.js";

const wasteroute = express.Router();
wasteroute.post("/store", postOfficeImageController.handleImage);

export default wasteroute;
