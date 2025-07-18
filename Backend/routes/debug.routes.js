const express = require('express');
const router = express.Router();
const captainModel = require('../models/captain.model');

router.get('/captains', async (req, res) => {
    try {
        const captains = await captainModel.find({}).select('fullname email socketId status location ltd lng');
        res.json({
            success: true,
            count: captains.length,
            captains: captains
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
