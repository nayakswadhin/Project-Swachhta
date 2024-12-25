import express from 'express';
import { SpitDetectionController } from '../controller/spitDetection.controller.js';

const router = express.Router();

router.post('/detect', SpitDetectionController.detectObjects);

export default router;