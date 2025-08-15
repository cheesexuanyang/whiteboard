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

  // Call this when the user submits the welcome form
  const connectToSession = (userData) => {
    setIsConnecting(true);
    setCurrentUser(userData);
    setShowWelcomeModal(false);
  };

  // Establish socket connection when a user has been set
  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io('http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true
    });

    // When the socket connects, mark as connected and send user info
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setIsConnecting(false);

      newSocket.emit('user-info', {
        name: currentUser.name,
        avatarColor: currentUser.avatarColor
      });
    });

    // Handle disconnections
    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setIsConnecting(false);
    });

    // Handle connection errors gracefully
    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnecting(false);
      addNotification('Failed to connect to server', 'error');
    });

    // Receive updates about all users
    newSocket.on('users-update', (users) => {
      setConnectedUsers(users);
    });

    // Notify when a new user joins
    newSocket.on('user-joined', (user) => {
      if (user.id !== newSocket.id) {
        addNotification(`${user.name} joined the session`, 'join');
      }
    });

    // Notify when a user leaves
    newSocket.on('user-left', (userId) => {
      const leftUser = connectedUsers.find(u => u.id === userId);
      if (leftUser) {
        addNotification(`${leftUser.name} left the session`, 'leave');
      }
    });

    // Save the socket in state
    setSocket(newSocket);

    // Clean up on unmount or when currentUser changes
    return () => {
      newSocket.close();
      setSocket(null);
      setIsConnected(false);
      setIsConnecting(false);
    };
  }, [currentUser]); // Notice: no isConnecting in the deps

  // Adds a notification and removes it after 4 seconds
  const addNotification = (message, type) => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: Date.now() };

    setNotifications(prev => [...prev, notification]);

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
