const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const newsController = require('../controllers/newsController');


// Fetch news articles for the logged-in user
router.get('/news', authenticateToken, newsController.getNews);

// Mark article as read
router.post('/news/:id/read', authenticateToken, newsController.markAsRead);

// Mark article as favorite
router.post('/news/:id/favorite', authenticateToken, newsController.markAsFavorite);

// Get all read articles
router.get('/news/read', authenticateToken, newsController.getReadArticles);

// Get all favorite articles
router.get('/news/favorites', authenticateToken, newsController.getFavoriteArticles);

// Search news articles by keyword
router.get('/news/search/:keyword', authenticateToken, newsController.searchNews);

module.exports = router;
