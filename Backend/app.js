// server.js (or index.js)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const path = require('path');

const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');
const campusRoutes = require('./routes/campus.routes');
const debugRoutes = require('./routes/debug.routes');

connectToDb();

const app = express();
const server = http.createServer(app);

// 1️⃣ Configure Express CORS (for your REST endpoints)
const allowedOrigins = [
  'https://hop-inn.vercel.app',
  'http://localhost:3000'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// 2️⃣ Configure Socket.io with its own CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', socket => {
  console.log(`⚡️ Socket connected: ${socket.id}`);

  socket.on('someEvent', data => {
    // handle incoming events
    socket.emit('someResponse', { msg: 'got it!' });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// 3️⃣ Standard middleware & routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/campus', campusRoutes);
app.use('/debug', debugRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);

const rootDir = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(rootDir, 'frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(rootDir, 'frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running successfully');
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
