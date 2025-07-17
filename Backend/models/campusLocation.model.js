const mongoose = require('mongoose');

const campusLocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    coordinates: {
        latitude: { 
            type: Number, 
            required: true 
        },
        longitude: { 
            type: Number, 
            required: true 
        }
    },
    type: {
        type: String,
        enum: ['gate', 'hostel', 'academic', 'sports', 'dining', 'medical', 'market', 'other'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    aliases: [String], // Alternative names for the location
    college: {
        type: String,
        default: 'IIT Bombay'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    floor: {
        type: String,
        required: false
    },
    building: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Add geospatial indexing for location-based queries
campusLocationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('CampusLocation', campusLocationSchema);
