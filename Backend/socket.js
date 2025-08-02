const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: ['https://hop-inn.vercel.app', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join', async ({ userId, userType }) => {
      console.log(`${userType} ${userId} joined with socket ${socket.id}`);

      if (userType === 'user') {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === 'captain') {
        await captainModel.findByIdAndUpdate(userId, {
          socketId: socket.id,
          status: 'active'
        });
        console.log(`✅ Captain ${userId} marked active with socketId: ${socket.id}`);
      }
    });

    socket.on('update-location-captain', async ({ userId, location }) => {
      if (!location || !location.ltd || !location.lng) {
        return socket.emit('error', { message: 'Invalid location data' });
      }

      await captainModel.findByIdAndUpdate(userId, {
        location: {
          type: 'Point',
          coordinates: [parseFloat(location.lng), parseFloat(location.ltd)]
        },
        ltd: location.ltd,
        lng: location.lng
      });

      console.log(`Updated captain ${userId} to location: [${location.lng}, ${location.ltd}]`);
    });

    socket.on('test-socket', (data) => {
      console.log('📨 Test socket received:', data);
      socket.emit('test-message', { message: 'Socket working!' });
    });

    socket.on('test-notification', (data) => {
      sendMessageToSocketId(socket.id, {
        event: 'new-ride',
        data: {
          rideId: 'test-123',
          pickup: 'Test Pickup',
          destination: 'Test Destination',
          fare: 50,
          vehicleType: 'car',
          message: 'This is a test notification'
        }
      });
    });

    socket.on('disconnect', async () => {
      console.log(`Client disconnected: ${socket.id}`);
      try {
        await captainModel.findOneAndUpdate(
          { socketId: socket.id },
          { status: 'inactive', socketId: null }
        );
      } catch (error) {
        console.log('Error updating captain status on disconnect:', error);
      }
    });
  });
}

function sendMessageToSocketId(socketId, messageObject) {
  console.log(`📤 Sending message to socket ${socketId}:`, messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
    console.log('✅ Message sent successfully');
  } else {
    console.log('❌ Socket.io not initialized.');
  }
}

module.exports = { initializeSocket, sendMessageToSocketId };
