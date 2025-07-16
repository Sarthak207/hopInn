const axios = require('axios');
const captainModel = require('../models/captain.model');

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
