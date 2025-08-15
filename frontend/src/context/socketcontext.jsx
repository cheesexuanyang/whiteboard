import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { generateUserName, generateAvatarColor } from '../utils/userUtils';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Generate user info on mount
  useEffect(() => {
    const userData = {
      name: generateUserName(),
      avatarColor: generateAvatarColor()
    };
    setCurrentUser(userData);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Create socket connection
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket'],
      query: {
        userName: currentUser.name,
        avatarColor: currentUser.avatarColor
      }
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // User management events
    newSocket.on('users-update', (users) => {
      setConnectedUsers(users);
    });

    newSocket.on('user-joined', (user) => {
      console.log('User joined:', user.name);
      addNotification(`${user.name} joined the session`, 'join');
    });

    newSocket.on('user-left', (user) => {
      console.log('User left:', user.name);
      addNotification(`${user.name} left the session`, 'leave');
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [currentUser]);

  const addNotification = (message, type) => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: Date.now() };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove notification after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const value = {
    socket,
    isConnected,
    connectedUsers,
    notifications,
    currentUser
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};