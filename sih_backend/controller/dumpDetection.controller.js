import { DumpDetectionService } from '../services/dumpDetection.service.js';

export class DumpDetectionController {
  static async detectObjects(req, res) {
    try {
      const { image } = req.body;
      
      if (!image) {
        return res.status(400).json({ error: 'No image provided' });
      }
   
      const result = await DumpDetectionService.detectObjects(image);
      console.log(result);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in image detection:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}