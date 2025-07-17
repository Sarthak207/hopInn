const axios = require('axios');
const captainModel = require('../models/captain.model');
const CampusLocation = require('../models/campusLocation.model');

module.exports.getAddressCoordinate = async (address) => {
    if (!address || address.trim() === '') {
        throw new Error('Address is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    if (!apiKey) {
        throw new Error('Google Maps API key is not configured');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url, {
            timeout: 10000
        });

        const { data } = response;
        
        if (data.status === 'OK' && data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng,
                formatted_address: data.results[0].formatted_address
            };
        } else {
            throw new Error(`Geocoding failed: ${data.status}`);
        }
    } catch (error) {
        console.error('Geocoding error:', error.message);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    if (!apiKey) {
        throw new Error('Google Maps API key is not configured');
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url, {
            timeout: 10000
        });

        const { data } = response;

        if (data.status === 'OK' && data.rows && data.rows.length > 0) {
            const element = data.rows[0].elements[0];
            
            if (element.status === 'OK') {
                return {
                    distance: element.distance,
                    duration: element.duration,
                    status: element.status
                };
            } else {
                throw new Error(`Route calculation failed: ${element.status}`);
            }
        } else {
            throw new Error(`Distance Matrix failed: ${data.status}`);
        }
    } catch (error) {
        console.error('Distance Matrix error:', error.message);
        throw error;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input || input.trim().length < 2) {
        throw new Error('Input must be at least 2 characters long');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    if (!apiKey) {
        throw new Error('Google Maps API key is not configured');
    }

    // Use exact same URL format that works in direct test
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        // Simplified axios call - no custom headers
        const response = await axios.get(url, {
            timeout: 10000
        });

        if (response.data.status === 'OK' && response.data.predictions) {
            return response.data.predictions
                .map(prediction => prediction.description)
                .filter(value => value && value.trim() !== '')
                .slice(0, 5);
        } else if (response.data.status === 'ZERO_RESULTS') {
            return [];
        } else {
            throw new Error(`Autocomplete failed: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Autocomplete error:', error.message);
        throw error;
    }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    if (!ltd || !lng || !radius) {
        throw new Error('Latitude, longitude and radius are required');
    }

    if (isNaN(ltd) || isNaN(lng) || isNaN(radius)) {
        throw new Error('Invalid coordinates or radius');
    }

    try {
        const radiusInRadians = radius / 6371;

        const captains = await captainModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[parseFloat(lng), parseFloat(ltd)], radiusInRadians]
                }
            }
        }).select('_id fullname vehicle location');

        return captains;
    } catch (error) {
        console.error('Error finding captains:', error.message);
        throw error;
    }
}

module.exports.getCampusLocations = async () => {
    try {
        const locations = await CampusLocation.find({ isActive: true }).sort({ name: 1 });
        return locations;
    } catch (error) {
        throw error;
    }
};

// NEW: Search campus locations by name or aliases
module.exports.searchCampusLocations = async (query) => {
    try {
        const locations = await CampusLocation.find({
            $and: [
                { isActive: true },
                {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { aliases: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } },
                        { type: { $regex: query, $options: 'i' } }
                    ]
                }
            ]
        }).sort({ name: 1 });
        return locations;
    } catch (error) {
        throw error;
    }
};

// NEW: Get campus locations by type (hostel, academic, sports, etc.)
module.exports.getCampusLocationsByType = async (type) => {
    try {
        const locations = await CampusLocation.find({ 
            isActive: true,
            type: type 
        }).sort({ name: 1 });
        return locations;
    } catch (error) {
        throw error;
    }
};

// NEW: Get nearby campus locations using geospatial queries
module.exports.getNearbyCampusLocations = async (latitude, longitude, radius = 1000) => {
    try {
        const locations = await CampusLocation.find({
            isActive: true,
            coordinates: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: radius
                }
            }
        });
        return locations;
    } catch (error) {
        throw error;
    }
};

// NEW: Get campus location by ID
module.exports.getCampusLocationById = async (locationId) => {
    try {
        const location = await CampusLocation.findById(locationId);
        return location;
    } catch (error) {
        throw error;
    }
};

// NEW: Get popular campus locations (gates, main buildings, etc.)
module.exports.getPopularCampusLocations = async () => {
    try {
        const locations = await CampusLocation.find({
            isActive: true,
            type: { $in: ['gate', 'academic', 'dining', 'sports'] }
        }).sort({ type: 1, name: 1 });
        return locations;
    } catch (error) {
        throw error;
    }
};
