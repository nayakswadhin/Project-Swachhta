import axios from 'axios';

export class GreenDetectionService {
    static async detectObjects(base64Image) {
        try {
            const response = await axios({
                method: "POST",
                url: "https://detect.roboflow.com/greenery-doapy/1",
                params: {
                    api_key: "0GBEODyLpDpZfkC4XUcB"
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
