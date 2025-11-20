import axios from 'axios';
import { BASE_URL } from '../config/api';

const API_BASE_URL = BASE_URL;


export const getNotifications = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-notifications`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};


export const markNotificationRead = async (notificationIds) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/mark-notification-read`, {
      notificationIds: Array.isArray(notificationIds) ? notificationIds : [notificationIds]
    });
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};


export const deleteNotification = async (notificationId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/delete-notification`, {
      notificationId
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};