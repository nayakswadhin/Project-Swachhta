import express from 'express';
import { detectBinColor } from '../services/binDetection.service.js';

const router = express.Router();

router.post('/detect', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Base64 image data is required'
      });
    }

    const result = await detectBinColor(image);
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

export default router;