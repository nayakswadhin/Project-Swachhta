import asyncHandler from 'express-async-handler';
import { User } from '../models/user.model.js';
import { DivisionalOffice } from '../models/DivisionalOffice.js';
import { Message } from '../models/Message.js';

// Send a message
export const sendMessage = asyncHandler(async (req, res) => {
  const { senderId, senderRole, recipientId, content, type = 'DIRECT', importance = 'INFO' } = req.body;

  // Validate recipient exists
  let recipient;
  if (senderRole === 'USER') {
    recipient = await DivisionalOffice.findById(recipientId);
  } else {
    recipient = await User.findById(recipientId);
  }

  if (!recipient) {
    res.status(404);
    throw new Error('Recipient not found');
  }

  const message = await Message.create({
    sender: {
      id: senderId,
      role: senderRole
    },
    recipient: {
      id: recipientId,
      role: senderRole === 'USER' ? 'DIVISIONAL_OFFICE' : 'USER'
    },
    content,
    type,
    importance
  });

  res.status(201).json(message);
});

// Get messages for user
export const getMessages = asyncHandler(async (req, res) => {
  const { userId, userRole, importance } = req.query;

  const query = {
    $or: [
      { 'sender.id': userId, 'sender.role': userRole },
      { 'recipient.id': userId, 'recipient.role': userRole }
    ]
  };

  // Add importance filter if provided
  if (importance) {
    query.importance = importance;
  }

  const messages = await Message.find(query)
    .sort({ 
      importance: 1, // Sort by importance (CRITICAL first)
      createdAt: -1  // Then by date (newest first)
    });

  res.json(messages);
});

// Mark message as read
export const markMessageAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { userId, userRole } = req.body;

  const message = await Message.findOne({
    _id: messageId,
    'recipient.id': userId,
    'recipient.role': userRole
  });

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  message.read = true;
  await message.save();

  res.json(message);
});

// Get unread messages count
export const getUnreadCount = asyncHandler(async (req, res) => {
  const { userId, userRole, importance } = req.query;

  const query = {
    'recipient.id': userId,
    'recipient.role': userRole,
    read: false
  };

  // Add importance filter if provided
  if (importance) {
    query.importance = importance;
  }

  const count = await Message.countDocuments(query);

  // Get counts by importance
  const countsByImportance = await Message.aggregate([
    {
      $match: {
        'recipient.id': mongoose.Types.ObjectId(userId),
        'recipient.role': userRole,
        read: false
      }
    },
    {
      $group: {
        _id: '$importance',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({ 
    totalUnread: count,
    byImportance: countsByImportance.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {})
  });
});