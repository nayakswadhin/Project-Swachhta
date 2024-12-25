import axios from 'axios';

export class OverflowDetectionService {
  static async detectObjects(base64Image) {
    try {
      if (!base64Image || typeof base64Image !== 'string') {
        throw new Error('Invalid image data');
      }

      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/-ve-ve/1",
        params: {
          api_key: "0GBEODyLpDpZfkC4XUcB"
        },
        data: base64Image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        timeout: 30000,
        maxContentLength: 10 * 1024 * 1024,
        validateStatus: status => status >= 200 && status < 300
      });
      
      if (!response.data) {
        throw new Error('No detection results received');
      }

      return response.data;
    } catch (error) {
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        throw new Error('Connection timeout - request took too long');
      }
      if (error.response?.status === 413) {
        throw new Error('Image size too large');
      }
      throw new Error(error.response?.data?.message || error.message || 'Detection failed');
    }
  }
}