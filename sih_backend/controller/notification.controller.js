import { CleanlinessScore } from '../models/cleanlinessScore.model.js';
import lifeScore from '../models/life.model.js';
import { PostOffice } from '../models/postOffice.model.js';
import { getIO } from '../utils/socketManager.js';


const notificationController = {
  // Get notifications (cleanliness scores) for a specific post office
  async getNotifications(req, res) {
    try {
      const { postOfficeId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const notifications = await CleanlinessScore.find({ postOfficeId })
        .sort({ time: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('postOfficeId', 'name location');

      const total = await CleanlinessScore.countDocuments({ postOfficeId });

      res.json({
        notifications: notifications.map(notification => ({
          id: notification._id,
          postOfficeId: notification.postOfficeId,
          score: notification.score,
          quantity: notification.quantity,
          percentageOrganicWaste: notification.percentageOrganicWaste,
          imageUrl: notification.imageUrl,
          time: notification.time,
          area: notification.Area,
          spit: notification.spit,
          dump: notification.dump
        })),
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getLifeNotifications(req, res) {
    try {
      const { postOfficeId } = req.params;
      const LIMIT = 10;  // Fixed limit of 10 latest scores
      
      // Get latest 10 life scores
      const lifeScores = await lifeScore.find({ postOfficeId })
        .sort({ time: -1 })  // Sort by time descending (newest first)
        .limit(LIMIT)
        .lean();
      
      if (lifeScores.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No life scores found for post office ID: ${postOfficeId}`
        });
      }
  
      const notifications = lifeScores.map(score => ({
        _id: score._id,
        postOfficeId: score.postOfficeId,
        lifeScore: score.score,
        parameters: {
          area: score.Area,
          plasticAmount: score.amountOfPlastic,
          recyclableWaste: score.recyclableCount,
          messiness: score.messyPercentage,
          binCount : score.bins,
          overflowStatus: score.overflow,
          timestamp: score.time
        },
        message: `Life score update for ${score.Area}: ${score.score.toFixed(2)}`,
        time: score.time
      }));
  
      res.status(200).json({
        success: true,
        notifications
      });
    } catch (error) {
      console.error('Error fetching life notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch life notifications',
        details: error.message
      });
    }
  },

  // Get recent notifications count for a post office
  async getRecentCount(req, res) {
    try {
      const { postOfficeId } = req.params;
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const count = await CleanlinessScore.countDocuments({
        postOfficeId,
        time: { $gte: twentyFourHoursAgo }
      });
      
      res.json({ recentCount: count });
    } catch (error) {
      console.error('Error fetching recent count:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get notifications by severity
  async getNotificationsBySeverity(req, res) {
    try {
      const { postOfficeId } = req.params;
      const { severity, page = 1, limit = 10 } = req.query;

      let scoreRange = {};
      if (severity === 'high') {
        scoreRange = { score: { $gt: 70 } };
      } else if (severity === 'medium') {
        scoreRange = { score: { $gt: 40, $lte: 70 } };
      } else if (severity === 'low') {
        scoreRange = { score: { $lte: 40 } };
      }

      const notifications = await CleanlinessScore.find({
        postOfficeId,
        ...scoreRange
      })
        .sort({ time: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('postOfficeId', 'name location');

      const total = await CleanlinessScore.countDocuments({
        postOfficeId,
        ...scoreRange
      });

      res.json({
        notifications,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total
      });
    } catch (error) {
      console.error('Error fetching notifications by severity:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get notifications by area
  async getNotificationsByArea(req, res) {
    try {
      const { postOfficeId } = req.params;
      const { area, page = 1, limit = 10 } = req.query;

      const notifications = await CleanlinessScore.find({
        postOfficeId,
        Area: area
      })
        .sort({ time: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('postOfficeId', 'name location');

      const total = await CleanlinessScore.countDocuments({
        postOfficeId,
        Area: area
      });

      res.json({
        notifications,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total
      });
    } catch (error) {
      console.error('Error fetching notifications by area:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get notification statistics
  async getNotificationStats(req, res) {
    try {
      const { postOfficeId } = req.params;
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const stats = await CleanlinessScore.aggregate([
        {
          $match: {
            postOfficeId: new mongoose.Types.ObjectId(postOfficeId),
            time: { $gte: twentyFourHoursAgo }
          }
        },
        {
          $group: {
            _id: null,
            avgScore: { $avg: '$score' },
            maxScore: { $max: '$score' },
            minScore: { $min: '$score' },
            totalNotifications: { $sum: 1 },
            avgOrganicWaste: { $avg: '$percentageOrganicWaste' }
          }
        }
      ]);

      res.json(stats[0] || {
        avgScore: 0,
        maxScore: 0,
        minScore: 0,
        totalNotifications: 0,
        avgOrganicWaste: 0
      });
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default notificationController;