import express from 'express';
import { getInfo, wasteManagement, markNotificationAsRead } from '../controller/waste.controller.js';

const router = express.Router();

router.get('/info', getInfo);
router.post('/management', wasteManagement);
router.put('/notifications/:id/read', markNotificationAsRead);

export default router;