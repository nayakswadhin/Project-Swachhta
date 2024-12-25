import { createServer } from "http";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./routes/user.routes.js";
import divisionalOfficeRoute from "./routes/divisionalOffice.route.js";
import cleanlinessRoute from "./routes/cleanlinessScore.routes.js";
import wasteRoute from "./routes/waste.route.js";
import postOfficeRoutes from "./routes/postOfficeRoutes.js";
import postOfficeImageRoutes from "./routes/postOfficeImageRoutes.js";
import messageRoute from "./routes/messageRoutes.js";
import wasteroute from "./routes/aIImage.route.js";
import binDetectionRoutes from "./routes/binDetection.routes.js";
import spitDetectionRoutes from "./routes/spitDetection.route.js";
import bodyParser from "body-parser";
import feedBackRoute from "./routes/feedBack.route.js";
import energyDataRoute from "./routes/energyData.route.js";
import notificationRoutes from "./routes/notification.routes.js";
import { initializeSocket } from "./utils/socketManager.js";
import overflowDetectionRoutes from "./routes/overflowDetection.routes.js";
import dataRoute from "./routes/data.route.js";
import geminiRoute from "./routes/gemini.route.js";
import GreenDetectionController from "./controller/greendetection.controller.js";
import greenScoreRoute from "./routes/greenScore.routes.js";
import { errorReportRoute } from "./routes/errorReportRoutes.js";
import dumpDetectionRoutes from "./routes/dumpDetection.route.js";

import regional from "./routes/regionalOfficer.route.js";
import stateRoute from "./routes/state.route.js";

const app = express();
const httpServer = createServer(app);
initializeSocket(httpServer);

const PORT = 3000;

// Increase payload size limit to 50MB
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Database connection
try {
  await mongoose.connect(
    "mongodb+srv://nayakswadhin25:1111111q@cluster0.kmfkz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("MongoDB connected successfully.");
} catch (error) {
  console.log("MongoDB connection error:", error);
}

// Routes
app.get("/health", (req, res) => {
  return res.status(200).json({ message: "health is good" });
});

app.use("/user", userRoute);
app.use("/cleanliness", cleanlinessRoute);
app.use("/", wasteRoute);
app.use("/do", divisionalOfficeRoute);
app.use("/post-office", postOfficeRoutes);
app.use("/images", postOfficeImageRoutes);
app.use("/messages", messageRoute);
app.use("/waste", wasteroute);
app.use("/bin-detection", binDetectionRoutes);
app.use("/spit-detection", spitDetectionRoutes);
app.use("/notify", notificationRoutes);
app.use("/feedback", feedBackRoute);
app.use("/energy-data", energyDataRoute);
app.use("/overflow-detection", overflowDetectionRoutes);
app.use("/api", dataRoute);
app.use("/gemini", geminiRoute);
app.post("/green/detect", GreenDetectionController.detectObjects);
app.use("/greenScore", greenScoreRoute);
app.use("/", errorReportRoute);
app.use("/greenScore", greenScoreRoute);
app.use("/ro", regional);
app.use("/state", stateRoute);
app.use("/dump-detection", dumpDetectionRoutes);

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
