import express from 'express';
import {
  sendMessage,
  getMessages,
  markMessageAsRead,
  getUnreadCount
} from '../controller/messageController.js';

const router = express.Router();


router.post('/', sendMessage);
router.get('/', getMessages);
router.patch('/:messageId/read', markMessageAsRead);
router.get('/unread-count', getUnreadCount);

export default router;