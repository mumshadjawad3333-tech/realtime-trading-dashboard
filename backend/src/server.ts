import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';

// Routes & Controllers
import tickerRoutes from './routes/ticker';
import { login, refresh } from './controllers/authController';
import { subscribeToTopic } from './controllers/notificationController';

// Services
import { startMarketSimulation, getCurrentState } from './services/simulator';
import './services/firebaseAdmin'; // Initialize Firebase Admin early

const app = express();
app.use(cors());
app.use(express.json());

// --- Routes ---
app.post('/api/login', login);
app.post('/api/refresh', refresh);

/**
 * New Notification Subscription Route
 * This allows the frontend to register tokens for background alerts
 */
app.post('/api/subscribe', subscribeToTopic);

app.use('/api/tickers', tickerRoutes);

// --- HTTP & Socket Initialization ---
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" } 
});

// --- Start the Simulation ---
// We pass the 'io' instance so the simulator can broadcast alerts/updates
startMarketSimulation(io);

// --- WebSocket Connections ---
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send the current "source of truth" immediately upon connection
  socket.emit('priceUpdate', getCurrentState());

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});