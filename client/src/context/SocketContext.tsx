'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

export interface RealtimeNotification {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'alert';
  timestamp: Date;
}

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
  notifications: RealtimeNotification[];
  clearNotifications: () => void;
  addNotification: (title: string, body: string, type?: 'info' | 'success' | 'alert') => void;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const { user } = useAuth();

  const addNotification = (title: string, body: string, type: 'info' | 'success' | 'alert' = 'info') => {
    const newNotif: RealtimeNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      body,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 20)); // Limit to last 20 notifs
  };

  useEffect(() => {
    // Connect to Socket.io server
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Join rooms based on authentication status
  useEffect(() => {
    if (socket && isConnected && user) {
      // Join user room for booking updates
      socket.emit('join_room', user.id);

      // Join admin broadcast if admin
      if (user.role === 'admin') {
        socket.emit('join_profession', 'admin');
      }

      // Clear general listeners to avoid duplication
      socket.off('booking_created');
      socket.off('booking_updated');

      // Listen for updates
      socket.on('booking_created', (booking) => {
        addNotification(
          '🆕 New Booking Request!',
          `A new request for ${booking.professionalId?.profession} (${booking.professionalId?.name}) has been scheduled.`,
          'info'
        );
      });

      socket.on('booking_updated', (booking) => {
        let type: 'info' | 'success' | 'alert' = 'info';
        if (booking.status === 'Accepted') type = 'success';
        if (booking.status === 'Completed') type = 'success';
        if (booking.status === 'Cancelled') type = 'alert';

        addNotification(
          `📅 Booking ${booking.status}`,
          `Your service booking with ${booking.professionalId?.name} is now ${booking.status}.`,
          type
        );
      });
    }
  }, [socket, isConnected, user]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        notifications,
        clearNotifications,
        addNotification
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
