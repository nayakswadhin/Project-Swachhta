import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { fetchNotifications, markNotificationAsRead } from '../lib/api';
import { formatNotifications, createNotificationFromWaste } from '../lib/notifications';

export const useNotifications = (postOfficeId: string) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const isInitializedRef = useRef(false);


  const handleNewWaste = useCallback((waste) => {

    console.log("waste", waste);
    if (waste.postOfficeId === postOfficeId) {
      const newNotification = createNotificationFromWaste(waste);
      setNotifications(prev => [newNotification, ...prev]);
      console.log("newNotification", newNotification);
    }
  }, [postOfficeId]);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications(postOfficeId);
      console.log('Notifications:', data);
      const formattedNotifications = formatNotifications(data);
      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
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
      console.log('Socket connected');
    });

    socketRef.current.on('wasteNotification', handleNewWaste);

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }, [handleNewWaste]);

  useEffect(() => {
    if (!isInitializedRef.current && postOfficeId) {
      isInitializedRef.current = true;
      initializeSocket();
      loadNotifications();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('wasteNotification');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [initializeSocket, loadNotifications, postOfficeId]);



  
  return {
    notifications,
    unreadCount,
    loading,
    refresh: loadNotifications
  };
};