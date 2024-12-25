import {GreenDetectionService} from "../services/greenDetection.service.js";

class GreenDetectionController {
    static async detectObjects(req, res) {
        try {
            const { image } = req.body;
            
            if (!image) {
                return res.status(400).json({ 
                    error: 'No image provided' 
                });
            }
     
            const result = await GreenDetectionService.detectObjects(image);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in image detection:', error);
            return res.status(500).json({ 
                error: error.message 
            });
        }
    }
}

export default GreenDetectionController;