const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req, res) => {
    try {
        const { pickup, destination, vehicleType, campusPickup, campusDestination } = req.body;
        // Remove otp from destructuring - backend will generate it
        
        // Check if this is a campus-to-campus ride
        if (campusPickup && campusDestination) {
            // Use campus coordinates directly, skip geocoding
            const rideData = {
                user: req.user._id,
                pickup,
                destination,
                vehicleType,
                // Remove otp from here - let backend generate it
                campusPickup,
                campusDestination,
                // Skip geocoding for campus locations
                pickupCoordinates: {
                    latitude: campusPickup.coordinates.latitude,
                    longitude: campusPickup.coordinates.longitude
                },
                destinationCoordinates: {
                    latitude: campusDestination.coordinates.latitude,
                    longitude: campusDestination.coordinates.longitude
                }
            };
            
            const ride = await rideService.createRide(rideData);
            return res.status(201).json({
                success: true,
                ride,
                message: 'Campus ride created successfully'
            });
        }
        
        // For non-campus rides, use geocoding
        try {
            const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
            const destinationCoordinates = await mapService.getAddressCoordinate(destination);
            
            const rideData = {
                user: req.user._id,
                pickup,
                destination,
                vehicleType,
                // Remove otp from here - let backend generate it
                pickupCoordinates,
                destinationCoordinates,
                campusPickup,
                campusDestination
            };
            
            const ride = await rideService.createRide(rideData);
            return res.status(201).json({
                success: true,
                ride,
                message: 'Ride created successfully'
            });
            
        } catch (geocodingError) {
            console.error('Geocoding failed:', geocodingError.message);
            return res.status(400).json({
                success: false,
                message: 'Unable to find the specified locations. Please check the addresses.',
                error: geocodingError.message
            });
        }
        
    } catch (error) {
        console.error('Error creating ride:', error);
        
        // Only send response if headers haven't been sent
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create ride',
                error: error.message
            });
        }
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    console.log('Confirming ride:', rideId);
    console.log('Captain:', req.captain);

    if (!rideId) {
        return res.status(400).json({ 
            success: false,
            message: 'Ride ID is required' 
        });
    }

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        console.log('Ride confirmed successfully:', ride);

        // Send confirmation to user
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json({
            success: true,
            ride,
            message: 'Ride confirmed successfully'
        });
    } catch (err) {
        console.error('Confirm ride error:', err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    // Add specific validation logs
    console.log('Start ride request:', { rideId, otp });
    console.log('Captain:', req.captain);

    if (!rideId) {
        return res.status(400).json({ 
            success: false,
            message: 'Ride ID is required' 
        });
    }

    if (!otp) {
        return res.status(400).json({ 
            success: false,
            message: 'OTP is required' 
        });
    }

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log('Ride started successfully:', ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        return res.status(200).json({
            success: true,
            ride,
            message: 'Ride started successfully'
        });
    } catch (err) {
        console.error('Start ride error:', err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        return res.status(200).json({
            success: true,
            ride,
            message: 'Ride ended successfully'
        });
    } catch (err) {
        console.error('End ride error:', err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    } 
}
