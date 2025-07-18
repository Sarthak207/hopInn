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

    // Check if both locations are campus locations (IIT Bombay specific)
    const isCampusRoute = await checkIfCampusRoute(origin, destination);
    
    if (isCampusRoute) {
        // Use campus-specific distance calculation
        return await calculateCampusDistance(origin, destination);
    }

    // Regular Google Maps API call for non-campus routes
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
            } else if (element.status === 'ZERO_RESULTS') {
                // Fallback to campus calculation if Google Maps fails
                console.warn('Google Maps returned ZERO_RESULTS, using campus calculation');
                return await calculateCampusDistance(origin, destination);
            } else {
                throw new Error(`Route calculation failed: ${element.status}`);
            }
        } else {
            throw new Error(`Distance Matrix failed: ${data.status}`);
        }
    } catch (error) {
        console.error('Distance Matrix error:', error.message);
        
        // If Google Maps fails, try campus calculation as fallback
        if (error.message.includes('ZERO_RESULTS')) {
            console.warn('Falling back to campus distance calculation');
            return await calculateCampusDistance(origin, destination);
        }
        
        throw error;
    }
}

// Helper function to check if route is within campus
const checkIfCampusRoute = async (origin, destination) => {
    try {
        const CampusLocation = require('../models/campusLocation.model');
        
        // Check if both origin and destination are campus locations
        const originLocation = await CampusLocation.findOne({
            $or: [
                { name: { $regex: origin, $options: 'i' } },
                { aliases: { $regex: origin, $options: 'i' } }
            ]
        });
        
        const destinationLocation = await CampusLocation.findOne({
            $or: [
                { name: { $regex: destination, $options: 'i' } },
                { aliases: { $regex: destination, $options: 'i' } }
            ]
        });
        
        return originLocation && destinationLocation;
    } catch (error) {
        console.error('Error checking campus route:', error);
        return false;
    }
};

// Campus-specific distance calculation
const calculateCampusDistance = async (origin, destination) => {
    try {
        const CampusLocation = require('../models/campusLocation.model');
        
        // Find campus locations by name
        const originLocation = await CampusLocation.findOne({
            $or: [
                { name: { $regex: origin, $options: 'i' } },
                { aliases: { $regex: origin, $options: 'i' } }
            ]
        });
        
        const destinationLocation = await CampusLocation.findOne({
            $or: [
                { name: { $regex: destination, $options: 'i' } },
                { aliases: { $regex: destination, $options: 'i' } }
            ]
        });
        
        if (!originLocation || !destinationLocation) {
            // If not found in campus locations, return default values
            return {
                distance: { text: '2.0 km', value: 2000 },
                duration: { text: '5 mins', value: 300 },
                status: 'OK'
            };
        }
        
        // Calculate straight-line distance using coordinates
        const distance = calculateHaversineDistance(
            originLocation.coordinates.latitude,
            originLocation.coordinates.longitude,
            destinationLocation.coordinates.latitude,
            destinationLocation.coordinates.longitude
        );
        
        // Estimate duration based on distance (assuming 20 km/h average speed on campus)
        const durationInMinutes = Math.max(2, Math.ceil((distance / 1000) * 3)); // Min 2 minutes
        
        return {
            distance: {
                text: `${distance < 1000 ? Math.round(distance) + ' m' : (distance / 1000).toFixed(1) + ' km'}`,
                value: Math.round(distance)
            },
            duration: {
                text: `${durationInMinutes} min${durationInMinutes > 1 ? 's' : ''}`,
                value: durationInMinutes * 60
            },
            status: 'OK'
        };
        
    } catch (error) {
        console.error('Error calculating campus distance:', error);
        
        // Return default campus values if calculation fails
        return {
            distance: { text: '1.5 km', value: 1500 },
            duration: { text: '4 mins', value: 240 },
            status: 'OK'
        };
    }
};

// Haversine formula for distance calculation
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
};

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

// UPDATED: getCaptainsInTheRadius function with proper GeoJSON support
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    if (!ltd || !lng || !radius) {
        throw new Error('Latitude, longitude and radius are required');
    }

    if (isNaN(ltd) || isNaN(lng) || isNaN(radius)) {
        throw new Error('Invalid coordinates or radius');
    }

    try {
        console.log(`Finding captains near [${lng}, ${ltd}] within ${radius}km`);

        // Convert radius from km to meters
        const radiusInMeters = radius * 1000;

        const captains = await captainModel.find({
            status: 'active',
            socketId: { $exists: true, $ne: null },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(ltd)]
                    },
                    $maxDistance: radiusInMeters
                }
            }
        }).select('_id fullname vehicle location socketId');

        console.log(`Found ${captains.length} active captains in radius`);
        return captains;
    } catch (error) {
        console.error('Error finding captains:', error.message);
        
        // Fallback to legacy location format
        try {
            const captains = await captainModel.find({
                status: 'active',
                socketId: { $exists: true, $ne: null },
                ltd: { $exists: true },
                lng: { $exists: true }
            }).select('_id fullname vehicle ltd lng socketId');

            console.log(`Fallback: Found ${captains.length} captains with legacy location format`);
            return captains;
        } catch (fallbackError) {
            console.error('Fallback query also failed:', fallbackError.message);
            throw error;
        }
    }
}

// ADDED: All campus location functions
module.exports.getCampusLocations = async () => {
    try {
        const locations = await CampusLocation.find({ isActive: true }).sort({ name: 1 });
        return locations;
    } catch (error) {
        console.error('Error fetching campus locations:', error);
        throw error;
    }
};

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
        console.error('Error searching campus locations:', error);
        throw error;
    }
};

module.exports.getCampusLocationsByType = async (type) => {
    try {
        const locations = await CampusLocation.find({ 
            isActive: true,
            type: type 
        }).sort({ name: 1 });
        return locations;
    } catch (error) {
        console.error('Error fetching campus locations by type:', error);
        throw error;
    }
};

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
        console.error('Error fetching nearby campus locations:', error);
        throw error;
    }
};

module.exports.getCampusLocationById = async (locationId) => {
    try {
        const location = await CampusLocation.findById(locationId);
        return location;
    } catch (error) {
        console.error('Error fetching campus location by ID:', error);
        throw error;
    }
};

module.exports.getPopularCampusLocations = async () => {
    try {
        const locations = await CampusLocation.find({
            isActive: true,
            type: { $in: ['gate', 'academic', 'dining', 'sports'] }
        }).sort({ type: 1, name: 1 });
        return locations;
    } catch (error) {
        console.error('Error fetching popular campus locations:', error);
        throw error;
    }
};

// Keep the legacy getFare export for backward compatibility
module.exports.getFare = async (pickup, destination) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    if (!apiKey) {
        throw new Error('Google Maps API key is not configured');
    }

    const base = { auto: 30, car: 50, moto: 20 };
    const perK = { auto: 10, car: 15, moto:  8 };
    const perM = { auto:  2, car:  3, moto: 1.5 };

    try {
        const distTime = await module.exports.getDistanceTime(pickup, destination);
        const km  = distTime.distance.value  / 1000;
        const min = distTime.duration.value / 60;

        return {
            auto: Math.round(base.auto + km * perK.auto + min * perM.auto),
            car : Math.round(base.car  + km * perK.car  + min * perM.car ),
            moto: Math.round(base.moto + km * perK.moto + min * perM.moto)
        };
    } catch (error) {
        console.error('Error calculating fare:', error);
        throw error;
    }
};
