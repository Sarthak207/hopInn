const mongoose = require('mongoose');

const blackListTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' }
});

// Prevent OverwriteModelError in dev/hot-reload
module.exports = mongoose.models.BlacklistToken || mongoose.model('BlacklistToken', blackListTokenSchema);