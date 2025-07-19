const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const preferencesController = require('../controllers/preferencesController');

// Get user preferences
router.get('/users/preferences', authenticateToken, preferencesController.getPreferences);

// Update user preferences
router.put('/users/preferences', authenticateToken, preferencesController.updatePreferences);

module.exports = router;
