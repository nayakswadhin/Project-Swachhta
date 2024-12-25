import express from 'express';
import { DumpDetectionController } from '../controller/dumpDetection.controller.js';

const router = express.Router();

router.post('/detect', DumpDetectionController.detectObjects);

export default router;