const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array()
            });
        }

        const { address } = req.query;
        const coordinates = await mapService.getAddressCoordinate(address);
        
        res.status(200).json({
            success: true,
            data: coordinates
        });
    } catch (error) {
        console.error('getCoordinates error:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Failed to get coordinates'
        });
    }
}

module.exports.getDistanceTime = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array()
            });
        }

        const { origin, destination } = req.query;
        const distanceTime = await mapService.getDistanceTime(origin, destination);

        res.status(200).json({
            success: true,
            data: distanceTime
        });
    } catch (error) {
        console.error('getDistanceTime error:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Failed to get distance and time'
        });
    }
}

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array()
            });
        }

        const { input } = req.query;
        const suggestions = await mapService.getAutoCompleteSuggestions(input);

        res.status(200).json({
            success: true,
            data: suggestions
        });
    } catch (error) {
        console.error('getAutoCompleteSuggestions error:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Failed to get suggestions'
        });
    }
}
