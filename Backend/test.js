// test-api-direct.js
const axios = require('axios');
require('dotenv').config();

const testDirect = async () => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    console.log('API Key from env:', apiKey);
    console.log('API Key length:', apiKey?.length);
    
    // Test with your exact API key
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=delhi&key=${apiKey}`;
    console.log('Full URL:', url);
    
    try {
        const response = await axios.get(url);
        console.log('SUCCESS - Status:', response.data.status);
        console.log('Predictions:', response.data.predictions?.length || 0);
    } catch (error) {
        console.error('FAILED - Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
};

testDirect();
