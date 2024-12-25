import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { fetchLifeNotifications } from '../lib/api';
import { formatDistanceToNow } from 'date-fns';

interface LifeNotification {
  postOfficeId: string;
  lifeScore: number;
  parameters: {
    area: string;
    plasticAmount: number;
    recyclableWaste: number;
    messiness: number;
    binCount: number;
    overflowStatus: number;
    timestamp: string;
  };
  message: string;
}

interface FormattedLifeAlert {
  id: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
  location: string;
  type: 'life';
  lifeScore: number;
  plasticAmount: number;
  recyclableWaste: number;
  messiness: number;
  binCount: number;
  overflowStatus: number;
}

export const useLifeNotifications = (postOfficeId: string) => {
  const [lifenotifications, setLifeNotifications] = useState<FormattedLifeAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentNotification, setCurrentNotification] = useState<LifeNotification | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const isInitializedRef = useRef(false);

  const formatLifeNotification = (notification: LifeNotification): FormattedLifeAlert => {
    const severity = 
      notification.lifeScore < 70 ? 'high' : 
      notification.lifeScore < 85 ? 'medium' : 
      'low';

    return {
      id: `${notification.postOfficeId}-${notification.parameters.timestamp}`,
      title: `Life Score Alert - ${notification.lifeScore.toFixed(2)}%`,
      message: notification.message,
      severity,
      time: notification.parameters.timestamp,
      location: notification.parameters.area,
      type: 'life',
      lifeScore: notification.lifeScore,
      plasticAmount: notification.parameters.plasticAmount,
      recyclableWaste: notification.parameters.recyclableWaste,
      messiness: notification.parameters.messiness,
      binCount: notification.parameters.binCount,
      overflowStatus: notification.parameters.overflowStatus
    };
  };

  const loadLifeNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchLifeNotifications(postOfficeId);
      console.log("data", data);
      const formattedNotifications = data.notifications.map(formatLifeNotification);
      setLifeNotifications(formattedNotifications);
      console.log("formattedNotifications", formattedNotifications);
    } catch (error) {
      console.error('Error loading life notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [postOfficeId]);

  const handleNewLife = useCallback((data: LifeNotification) => {
    if (data.postOfficeId === postOfficeId) {
      setCurrentNotification(data);
      const formattedNotification = formatLifeNotification(data);
      setLifeNotifications(prev => [formattedNotification, ...prev]);
    }
  }, [postOfficeId]);

  const initializeSocket = useCallback(() => {
    if (socketRef.current?.connected) return;

    socketRef.current = io('http://localhost:3000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected for life notifications');
    });

    socketRef.current.on('lifeNotification', handleNewLife);

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected from life notifications');
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error in life notifications:', error);
    });
  }, [handleNewLife]);

  useEffect(() => {
    if (!isInitializedRef.current && postOfficeId) {
      isInitializedRef.current = true;
      initializeSocket();
      loadLifeNotifications();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('lifeNotification');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initializeSocket, loadLifeNotifications, postOfficeId]);

  const clearNotification = useCallback(() => {
    setCurrentNotification(null);
  }, []);

  return {
    lifenotifications,
    loading,
    currentNotification,
    clearNotification,
  };
};