const User = require('../models/user');

// GET /preferences - Retrieve logged-in user's preferences
exports.getPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        // Always return preferences as array, and ensure latest update is reflected
        // If preferences were updated, return the updated array
        res.json({ preferences: Array.isArray(user.preferences) ? user.preferences : [] });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// PUT /preferences - Update user's news preferences
exports.updatePreferences = async (req, res) => {
    try {
        const { preferences } = req.body;
        if (!Array.isArray(preferences)) {
            return res.status(400).json({ message: 'Preferences must be an array of strings.' });
        }
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.preferences = preferences;
        await user.save();
        res.json({ message: 'Preferences updated', preferences: user.preferences });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
