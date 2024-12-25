import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const fetchNotifications = async (postOfficeId: string, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/notify/post-office/${postOfficeId}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const fetchLifeNotifications = async (postOfficeId: string) => {
  try {
    const response = await axios.get(`${API_URL}/notify/life/${postOfficeId}`);
    console.log("response.data", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching life notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await axios.patch(`${API_URL}/notifiy/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};