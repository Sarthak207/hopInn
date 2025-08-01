const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: 'https://hopinn-1.onrender.com',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`${userType} ${userId} joined with socket ${socket.id}`);

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { 
                    socketId: socket.id,
                    status: 'active' // Mark captain as active when they connect
                });
                console.log(`✅ Captain ${userId} marked as active with socketId: ${socket.id}`);
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            // Update both new GeoJSON format and legacy format
            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(location.lng), parseFloat(location.ltd)] // [lng, lat]
                },
                // Keep legacy fields for backward compatibility
                ltd: location.ltd,
                lng: location.lng
            });

            console.log(`Captain ${userId} location updated to [${location.lng}, ${location.ltd}]`);
        });

        // MOVE THESE OUTSIDE OF THE LOCATION UPDATE HANDLER
        socket.on('test-socket', (data) => {
            console.log('📨 Test socket received:', data);
            socket.emit('test-message', { message: 'Socket working!' });
        });

        socket.on('test-notification', (data) => {
            console.log('🧪 Testing notification to captain:', data.captainId);
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
            
            // Mark captain as inactive when they disconnect
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

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log(`📤 Sending message to socket ${socketId}:`, messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
        console.log(`✅ Message sent successfully`);
    } else {
        console.log('❌ Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };
