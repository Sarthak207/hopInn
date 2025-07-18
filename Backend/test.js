require('dotenv').config();
const mongoose = require('mongoose');
const captainModel = require('./models/captain.model');
const bcrypt = require('bcrypt');

const createTestCaptain = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        
        // Create test captain
        const testCaptain = await captainModel.create({
            fullname: {
                firstname: 'Test',
                lastname: 'Driver'
            },
            email: 'testdriver2@iitb.ac.in',
            password: await captainModel.hashPassword('password123'),
            vehicle: {
                color: 'Red',
                plate: 'MH12AB1234',
                capacity: 4,
                vehicleType: 'car'
            },
            status: 'active',
            location: {
                type: 'Point',
                coordinates: [72.9133, 19.1334] // IIT Bombay main gate
            },
            ltd: 19.1334,
            lng: 72.9133
        });
        
        console.log('✅ Test captain created:', testCaptain._id);
        console.log('📧 Email: testdriver2@iitb.ac.in');
        console.log('🔐 Password: password123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createTestCaptain();
