const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const mapsService = require('../services/maps.service');
const authMiddleware = require('../middlewares/auth.middleware');

// Get all campus locations
router.get('/locations', authMiddleware.authUser, async (req, res) => {
    try {
        const locations = await mapsService.getCampusLocations();
        res.json({
            success: true,
            locations: locations,
            count: locations.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Search campus locations
router.get('/search', authMiddleware.authUser, async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }
        
        const locations = await mapsService.searchCampusLocations(query);
        res.json({
            success: true,
            locations: locations,
            count: locations.length,
            query: query
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get campus locations by type
router.get('/locations/type/:type', authMiddleware.authUser, async (req, res) => {
    try {
        const { type } = req.params;
        
        const validTypes = ['gate', 'hostel', 'academic', 'sports', 'dining', 'medical', 'market', 'other'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid location type'
            });
        }
        
        const locations = await mapsService.getCampusLocationsByType(type);
        res.json({
            success: true,
            locations: locations,
            count: locations.length,
            type: type
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get nearby campus locations
router.get('/locations/nearby', authMiddleware.authUser, async (req, res) => {
    try {
        const { latitude, longitude, radius = 1000 } = req.query;
        
        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }
        
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const rad = parseInt(radius);
        
        if (isNaN(lat) || isNaN(lng) || isNaN(rad)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinates or radius'
            });
        }
        
        const locations = await mapsService.getNearbyCampusLocations(lat, lng, rad);
        res.json({
            success: true,
            locations: locations,
            count: locations.length,
            center: { latitude: lat, longitude: lng },
            radius: rad
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get popular campus locations
router.get('/locations/popular', authMiddleware.authUser, async (req, res) => {
    try {
        const locations = await mapsService.getPopularCampusLocations();
        res.json({
            success: true,
            locations: locations,
            count: locations.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get single campus location by ID
router.get('/locations/:id', authMiddleware.authUser, async (req, res) => {
    try {
        const { id } = req.params;
        
        const location = await mapsService.getCampusLocationById(id);
        
        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }
        
        res.json({
            success: true,
            location: location
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get hostels only (frequently used)
router.get('/hostels', authMiddleware.authUser, async (req, res) => {
    try {
        const hostels = await mapsService.getCampusLocationsByType('hostel');
        res.json({
            success: true,
            hostels: hostels,
            count: hostels.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get gates only (frequently used)
router.get('/gates', authMiddleware.authUser, async (req, res) => {
    try {
        const gates = await mapsService.getCampusLocationsByType('gate');
        res.json({
            success: true,
            gates: gates,
            count: gates.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
