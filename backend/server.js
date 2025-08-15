const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.io
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Store active users and drawing data
let connectedUsers = new Map();
let drawingHistory = []; // Store drawing events for new users

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user info when they provide it
  socket.on('user-info', (userData) => {
    const user = {
      id: socket.id,
      name: userData.name,
      avatarColor: userData.avatarColor,
      cursor: { x: 0, y: 0 }
    };

    // Add user to connected users
    connectedUsers.set(socket.id, user);

    // Send current drawing history to new user
    socket.emit('drawing-history', drawingHistory);

    // Send current connected users to everyone
    io.emit('users-update', Array.from(connectedUsers.values()));
    
    // Notify others that this user joined
    socket.broadcast.emit('user-joined', user);

    console.log(`User ${userData.name} joined with ID: ${socket.id}`);
  });

  // Handle drawing events
  socket.on('drawing', (data) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    // Add drawing event to history
    const drawingEvent = {
      ...data,
      userId: socket.id,
      timestamp: Date.now()
    };
    
    drawingHistory.push(drawingEvent);
    
    // Keep only last 1000 drawing events to prevent memory issues
    if (drawingHistory.length > 1000) {
      drawingHistory = drawingHistory.slice(-1000);
    }

    // Broadcast to all other users
    socket.broadcast.emit('drawing', drawingEvent);
  });

  // Handle cursor movement
  socket.on('cursor-move', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.cursor = data;
      socket.broadcast.emit('cursor-move', {
        userId: socket.id,
        ...data
      });
    }
  });

  // Handle color change
  socket.on('color-change', (color) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.color = color;
      socket.broadcast.emit('user-color-change', {
        userId: socket.id,
        color: color
      });
    }
  });

  // Handle canvas clear
  socket.on('clear-canvas', () => {
    drawingHistory = []; // Clear drawing history
    socket.broadcast.emit('clear-canvas');
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`User ${user.name} disconnected: ${socket.id}`);
      connectedUsers.delete(socket.id);
      
      // Notify others that this user left
      socket.broadcast.emit('user-left', socket.id);
      io.emit('users-update', Array.from(connectedUsers.values()));
    } else {
      console.log(`Unknown user disconnected: ${socket.id}`);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io server ready for connections`);
});