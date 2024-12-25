import { PostOffice } from '../models/postOffice.model.js';
import { EnergyData } from '../models/energyData.model.js';

export class EnergyDataController {
  static async create(req, res) {
    try {
      // Validate required fields
      const { postOfficeId, roomType, duration, energyKWh, efficiency } = req.body;

      if (!postOfficeId || !roomType || !duration || !energyKWh || !efficiency) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: postOfficeId, roomType, duration, energyKWh, and efficiency are required'
        });
      }

      // Validate data types and ranges
      if (typeof duration !== 'number' || duration <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Duration must be a positive number'
        });
      }

      if (typeof energyKWh !== 'number' || energyKWh <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Energy consumption must be a positive number'
        });
      }

      if (!['efficient', 'moderate', 'inefficient'].includes(efficiency)) {
        return res.status(400).json({
          success: false,
          message: 'Efficiency must be one of: efficient, moderate, inefficient'
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

      const energyData = new EnergyData({
        postOfficeId,
        roomType,
        duration,
        energyKWh,
        efficiency,
        timestamp: new Date()
      });
      
      await energyData.save();

      // Get historical energy data for this post office
      const historicalData = await EnergyData.find({ 
        postOfficeId: postOfficeId 
      }).sort({ timestamp: -1 }); // Sort by newest first
      
      // Enhanced efficiency scores with more granular values
      const efficiencyScores = {
        efficient: 95,    // Increased from 90
        moderate: 75,     // Increased from 70
        inefficient: 45   // Decreased from 50
      };
  
      // Calculate weighted average with time decay
      const MAX_RECORDS = 50; // Limit the number of records considered
      const DECAY_FACTOR = 0.95; // Decay factor for older records
      
      let weightedSum = 0;
      let weightSum = 0;
      
      // Start with current record (highest weight)
      weightedSum += efficiencyScores[efficiency];
      weightSum += 1;
      
      // Process historical records with decay
      historicalData.slice(0, MAX_RECORDS - 1).forEach((record, index) => {
        const weight = Math.pow(DECAY_FACTOR, index + 1);
        weightedSum += efficiencyScores[record.efficiency] * weight;
        weightSum += weight;
      });
  
      // Calculate final energy score (0-100)
      const energyScore = Math.round(weightedSum / weightSum);
      
      // Update post office with new energy score
      const updatedPostOffice = await PostOffice.findByIdAndUpdate(
        postOfficeId,
        { energyScore },
        { new: true }
      );
      
      return res.status(201).json({
        success: true,
        data: {
          ...energyData.toObject(),
          energyScore
        },
        message: 'Energy data recorded successfully'
      });
    } catch (error) {
      console.error('Energy data creation error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to record energy data'
      });
    }
  }

  static async getByPostOffice(req, res) {
    try {
      const { postOfficeId } = req.params;
      const energyData = await EnergyData.find({ postOfficeId }).sort({ timestamp: -1 });
      
      return res.status(200).json({
        success: true,
        data: energyData
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch energy data'
      });
    }
  }
}