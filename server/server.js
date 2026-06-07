import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/auth.js';
import professionalRoutes from './routes/professionals.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all client connections in hackathon modes
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// Pass Socket.io instance to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Socket.io Real-time connection handlers
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // User joins a room named after their UserId for targeted status alerts
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`Socket Client ${socket.id} joined user room: ${userId}`);
  });

  // Professionals join a room for their profession or area for emergency broadcasts
  socket.on('join_profession', (profession) => {
    socket.join(profession);
    console.log(`Socket Client ${socket.id} joined profession room: ${profession}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`FixMate AI backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
