const mongoose = require('mongoose');

// Create a completely fresh schema
const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
    },
    pickup: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: [ 'pending', 'accepted', "ongoing", 'completed', 'cancelled' ],
        default: 'pending',
    },
    duration: {
        type: Number,
    },
    distance: {
        type: Number,
    },
    paymentID: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
    otp: {
        type: String,
        select: false,
        required: true,
    },
    // Campus location fields - defined as mixed objects
    campusPickup: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    campusDestination: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    }
});

// Clear any existing model to avoid conflicts
if (mongoose.models.ride) {
    delete mongoose.models.ride;
}

module.exports = mongoose.model('ride', rideSchema);
