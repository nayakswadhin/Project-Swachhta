import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { WasteNotification } from '../types/waste';
import { WASTE_EVENTS } from '../constants/events';

const SOCKET_URL = 'http://localhost:3000';

export const useSocket = (onNewWaste: (waste: WasteNotification) => void) => {
  const socketRef = useRef<Socket | null>(null);

  const connectSocket = useCallback(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      console.log('Socket connecting...');

      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current?.id);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      // Listen for both regular and critical waste events
      socketRef.current.on(WASTE_EVENTS.NEW_WASTE, (waste: WasteNotification) => {
        console.log('New waste notification received:', waste);
        onNewWaste(waste);
      });

      socketRef.current.on(WASTE_EVENTS.CRITICAL_WASTE, (waste: WasteNotification) => {
        console.log('Critical waste notification received:', waste);
        onNewWaste({ ...waste, isCritical: true });
      });
    }
  }, [onNewWaste]);

  useEffect(() => {
    connectSocket();

    return () => {
      if (socketRef.current) {
        console.log('Disconnecting socket');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connectSocket]);

  return socketRef.current;
};