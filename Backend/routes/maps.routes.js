const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const { query } = require('express-validator');

// Get coordinates from address
router.get('/get-coordinates',
    [
        query('address')
            .isString()
            .isLength({ min: 3, max: 200 })
            .trim()
    ],
    authMiddleware.authUser,
    mapController.getCoordinates
);

// Get distance and time between two locations
router.get('/get-distance-time',
    [
        query('origin')
            .isString()
            .isLength({ min: 3, max: 200 })
            .trim(),
        query('destination')
            .isString()
            .isLength({ min: 3, max: 200 })
            .trim()
    ],
    authMiddleware.authUser,
    mapController.getDistanceTime
);

// Get autocomplete suggestions - TEMPORARILY WITHOUT AUTH
router.get('/get-suggestions',
    [
        query('input')
            .isString()
            .isLength({ min: 2, max: 100 })
            .trim()
    ],
    //authMiddleware.authUser,  // <- Commented out temporarily
    mapController.getAutoCompleteSuggestions
);

module.exports = router;
