import axios from 'axios';

export class DumpDetectionService {
  static async detectObjects(base64Image) {
    try {
      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/aerial-dumping-sites/3",
        params: {
          api_key: "kOnhxeEBVldEJhB258UO",
          confidence: 25  // Lowered confidence threshold to 25%
        },
        data: base64Image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Image detection failed: ${error.message}`);
    }
  }
}