import express from 'express';
import notificationController from '../controller/notification.controller.js';

const router = express.Router();

// Get notifications for a post office
router.get('/post-office/:postOfficeId', notificationController.getNotifications);

router.get('/life/:postOfficeId', notificationController.getLifeNotifications);

// Get recent notifications count
router.get('/recent-count/:postOfficeId', notificationController.getRecentCount);

// Get notifications by severity
router.get('/post-office/:postOfficeId/severity', notificationController.getNotificationsBySeverity);

// Get notifications by area
router.get('/post-office/:postOfficeId/area', notificationController.getNotificationsByArea);

// Get notification statistics
router.get('/post-office/:postOfficeId/stats', notificationController.getNotificationStats);

export default router;