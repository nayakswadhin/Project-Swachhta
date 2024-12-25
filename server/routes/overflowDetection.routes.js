import express from 'express';
import { OverflowDetectionService } from '../services/overflowDetection.service.js';

const router = express.Router();

router.post('/detect', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No image provided'
      });
    }

    if (typeof image !== 'string' || !image.includes('base64')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Must be base64 encoded'
      });
    }

    if (image.length > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image size too large. Maximum size is 10MB'
      });
    }
 
    const result = await OverflowDetectionService.detectObjects(image);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in overflow detection:', error);
    
    if (error.message.includes('ECONNRESET')) {
      return res.status(504).json({
        success: false,
        message: 'Request timeout - please try again'
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

export default router;