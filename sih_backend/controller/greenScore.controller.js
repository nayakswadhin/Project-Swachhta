import { PostOffice } from '../models/postOffice.model.js';
import { GreenScore } from '../models/greenScore.js';

export class GreenScoreController {
  static async create(req, res) {
    try {
      const { postOfficeId, score } = req.body;

      // Validate required fields
      if (!postOfficeId || !score) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: postOfficeId and score are required'
        });
      }

      // Validate score value
      if (!['poor', 'good', 'excellent', 'average'].includes(score)) {
        return res.status(400).json({
          success: false,
          message: 'Score must be one of: poor, good, excellent, average'
        });
      }

      // Validate postOfficeId exists
      const postOffice = await PostOffice.findById(postOfficeId);
      if (!postOffice) {
        return res.status(400).json({
          success: false,
          message: 'Invalid post office ID'
        });
      }

      // Create new green score entry
      const greenScore = new GreenScore({
        postOfficeId,
        score,
        timestamp: new Date()
      });
      
      await greenScore.save();

      // Get recent green scores for this post office (last 30 days)
      const recentScores = await GreenScore.find({
        postOfficeId,
        timestamp: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }).sort({ timestamp: -1 });

      // Calculate weighted scores
      const scoreValues = {
        'poor': 25,
        'average': 50,
        'good': 75,
        'excellent': 100
      };

      const DECAY_FACTOR = 0.95;
      let weightedSum = 0;
      let weightSum = 0;

      recentScores.forEach((record, index) => {
        const weight = Math.pow(DECAY_FACTOR, index);
        weightedSum += scoreValues[record.score] * weight;
        weightSum += weight;
      });

      const averageScore = Math.round(weightedSum / weightSum);
      
      // Convert numerical average back to category
      let finalGreenScore;
      if (averageScore <= 25) finalGreenScore = 'poor';
      else if (averageScore <= 50) finalGreenScore = 'average';
      else if (averageScore <= 75) finalGreenScore = 'good';
      else finalGreenScore = 'excellent';

      // Update post office with new green score
      const updatedPostOffice = await PostOffice.findByIdAndUpdate(
        postOfficeId,
        { greenScore: finalGreenScore },
        { new: true }
      );

      return res.status(201).json({
        success: true,
        data: {
          greenScore: greenScore.toObject(),
          averageScore: finalGreenScore,
          postOffice: updatedPostOffice
        },
        message: 'Green score recorded successfully'
      });

    } catch (error) {
      console.error('Green score creation error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to record green score'
      });
    }
  }

  static async getByPostOffice(req, res) {
    try {
      const { postOfficeId } = req.params;
      
      // Validate postOfficeId exists
      const postOffice = await PostOffice.findById(postOfficeId);
      if (!postOffice) {
        return res.status(400).json({
          success: false,
          message: 'Invalid post office ID'
        });
      }

      const greenScores = await GreenScore.find({ postOfficeId })
        .sort({ timestamp: -1 })
        .limit(50); // Limit to last 50 records
      
      return res.status(200).json({
        success: true,
        data: {
          scores: greenScores,
          currentScore: postOffice.greenScore
        }
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch green scores'
      });
    }
  }
}