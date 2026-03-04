
const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const { verifyToken } = require('./src/config/jwt');
const User = require('./src/models/User');
const notificationService = require('./src/services/notificationService');

const PORT = process.env.PORT || 3000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.IO with CORS matching the Express CORS config
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
        return callback(null, true);
      }
      callback(null, false);
    },
    credentials: true,
  },
  pingInterval: 25000,
  pingTimeout: 20000,
});

// Socket.IO auth middleware — verify JWT from handshake
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('Authentication required'));

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('_id name email role');
    if (!user) return next(new Error('User not found'));

    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  const userId = socket.user._id.toString();
  console.log(`Socket connected: ${socket.user.name} (${userId})`);

  // Join user-specific room for targeted notifications
  socket.join(`user:${userId}`);

  // Join role-based room
  if (socket.user.role) {
    socket.join(`role:${socket.user.role}`);
  }

  // Client can request unread count on connect
  socket.on('get:unread-count', async () => {
    try {
      const count = await notificationService.getUnreadCount(socket.user._id);
      socket.emit('unread-count', { count });
    } catch (err) {
      socket.emit('error', { message: 'Failed to get unread count' });
    }
  });

  // Client marks a notification as read via socket
  socket.on('mark:read', async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId, socket.user._id);
      const count = await notificationService.getUnreadCount(socket.user._id);
      socket.emit('unread-count', { count });
    } catch (err) {
      socket.emit('error', { message: 'Failed to mark notification as read' });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected: ${socket.user.name} (${reason})`);
  });
});

// Inject io into notification service so it can emit events
notificationService.setIO(io);

// Make io accessible from req in Express routes if needed
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO ready on port ${PORT}`);
});
