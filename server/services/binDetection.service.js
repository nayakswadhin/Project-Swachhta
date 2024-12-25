import axios from 'axios';
import { ROBOFLOW_CONFIG } from '../config/roboflow.config.js';

/**
 * Error class for bin detection related errors
 */
class BinDetectionError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'BinDetectionError';
    this.statusCode = statusCode;
  }
}

/**
 * Detects bin color from a base64 image using Roboflow API
 * @param {string} base64Image - Base64 encoded image data
 * @returns {Promise<Object>} - Object containing array of bin predictions
 * @throws {BinDetectionError} - If detection fails or validation errors occur
 */
export const detectBinColor = async (base64Image) => {
  try {
    // Validate input
    if (!base64Image || typeof base64Image !== 'string') {
      throw new BinDetectionError('Base64 image data is required', 400);
    }

    // Remove data URL prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // Make API request with confidence threshold
    const response = await axios({
      method: 'POST',
      url: ROBOFLOW_CONFIG.API_URL,
      params: {
        api_key: ROBOFLOW_CONFIG.API_KEY,
        confidence: 0.3
      },
      data: base64Data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 10000 // 10 second timeout
    });

    // Process and validate response
    if (!response.data || !response.data.predictions) {
      throw new BinDetectionError('Invalid response from detection service');
    }

    const predictions = response.data.predictions;
    if (predictions.length === 0) {
      return {
        success: true,
        message: 'No bins detected in image',
        predictions: []
      };
    }

    // Map predictions to a cleaner format
    const formattedPredictions = predictions.map(prediction => ({
      type: prediction.class,
      confidence: prediction.confidence,
      location: {
        x: prediction.x,
        y: prediction.y,
        width: prediction.width,
        height: prediction.height
      },
      classId: prediction.class_id,
      detectionId: prediction.detection_id
    }));

  

    return {
      success: true,
      message: `${predictions.length} bin(s) detected`,
      predictions: formattedPredictions
    };

  } catch (error) {
    if (error instanceof BinDetectionError) {
      throw error;
    }
    
    if (error.response) {
      throw new BinDetectionError(
        `API Error: ${error.response.data.message || 'Unknown API error'}`,
        error.response.status
      );
    }

    if (error.code === 'ECONNABORTED') {
      throw new BinDetectionError('Request timeout', 504);
    }

    throw new BinDetectionError(
      `Detection failed: ${error.message}`,
      500
    );
  }
};