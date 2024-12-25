import { SpitDetectionService } from '../services/spitDetection.service.js';

export class SpitDetectionController {
  static async detectObjects(req, res) {
    try {
      const { image } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: 'No image provided' });
      }
   
      const result = await SpitDetectionService.detectObjects(image);
      console.log(result);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in image detection:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}