import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { generateAvatarColor, getInitials } from '../userutils/userutils';

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
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  const connectToSession = (userData) => {
    setIsConnecting(true);
    setCurrentUser(userData);
    setShowWelcomeModal(false);
  };

  useEffect(() => {
    if (!currentUser || !isConnecting) return;

    // Create socket connection
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setIsConnecting(false);
      
      // Send user info after connection
      newSocket.emit('user-info', {
        name: currentUser.name,
        avatarColor: currentUser.avatarColor
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setIsConnecting(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnecting(false);
      addNotification('Failed to connect to server', 'error');
    });

    // User management events
    newSocket.on('users-update', (users) => {
      setConnectedUsers(users);
    });

    newSocket.on('user-joined', (user) => {
      console.log('User joined:', user.name);
      if (user.id !== newSocket.id) {
        addNotification(`${user.name} joined the session`, 'join');
      }
    });

    newSocket.on('user-left', (userId) => {
      console.log('User left:', userId);
      const leftUser = connectedUsers.find(u => u.id === userId);
      if (leftUser) {
        addNotification(`${leftUser.name} left the session`, 'leave');
      }
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
      setSocket(null);
      setIsConnected(false);
      setIsConnecting(false);
    };
  }, [currentUser, isConnecting]);

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
    isConnecting,
    connectedUsers,
    notifications,
    currentUser,
    showWelcomeModal,
    connectToSession,
    generateAvatarColor,
    getInitials,
    addNotification
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};