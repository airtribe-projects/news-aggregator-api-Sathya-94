const axios = require('axios');
const User = require('../models/user');
const NewsCache = require('../models/newsCache');

// Helper: fetch and cache news articles
async function fetchAndCacheNews(userId, categories, languages) {
    const apiKey = process.env.NEWS_API_KEY;
    let params = {
        apiKey,
        category: categories.join(','),
        language: languages[0] || 'en',
        pageSize: 20
    };
    Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
    });
    const response = await axios.get('https://newsapi.org/v2/top-headlines', { params });
    // Cache articles
    const articles = response.data.articles.map(a => ({
        articleId: a.url, // Use URL as unique id
        data: a,
        read: false,
        favorite: false
    }));
    await NewsCache.findOneAndUpdate(
        { userId },
        { articles, lastUpdated: Date.now() },
        { upsert: true }
    );
    return articles;
}

// GET /news - Fetch news articles for the logged-in user based on preferences, with caching
exports.getNews = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const { categories = [], languages = [] } = user.preferences || {};
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) return res.status(500).json({ message: 'News API key not configured' });

        let cache = await NewsCache.findOne({ userId: user._id });
        const cacheValid = cache && (Date.now() - new Date(cache.lastUpdated).getTime() < 15 * 60 * 1000); // 15 min
        let articles;
        if (cacheValid) {
            articles = cache.articles.map(a => a.data);
        } else {
            articles = await fetchAndCacheNews(user._id, categories, languages);
            articles = articles.map(a => a.data);
        }
        res.status(200).json({ news: articles });
    } catch (err) {
        if (err.response) {
            return res.status(err.response.status).json({ message: err.response.data.message || 'News API error' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// POST /news/:id/read - Mark article as read
exports.markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.id;
        const cache = await NewsCache.findOne({ userId });
        if (!cache) return res.status(404).json({ message: 'No cached articles found.' });
        const article = cache.articles.find(a => a.articleId === articleId);
        if (!article) return res.status(404).json({ message: 'Article not found.' });
        article.read = true;
        await cache.save();
        res.json({ message: 'Article marked as read.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// POST /news/:id/favorite - Mark article as favorite
exports.markAsFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const articleId = req.params.id;
        const cache = await NewsCache.findOne({ userId });
        if (!cache) return res.status(404).json({ message: 'No cached articles found.' });
        const article = cache.articles.find(a => a.articleId === articleId);
        if (!article) return res.status(404).json({ message: 'Article not found.' });
        article.favorite = true;
        await cache.save();
        res.json({ message: 'Article marked as favorite.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET /news/read - Retrieve all read news articles
exports.getReadArticles = async (req, res) => {
    try {
        const userId = req.user.id;
        const cache = await NewsCache.findOne({ userId });
        if (!cache) return res.json({ articles: [] });
        const articles = cache.articles.filter(a => a.read).map(a => a.data);
        res.json({ articles });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET /news/favorites - Retrieve all favorite news articles
exports.getFavoriteArticles = async (req, res) => {
    try {
        const userId = req.user.id;
        const cache = await NewsCache.findOne({ userId });
        if (!cache) return res.json({ articles: [] });
        const articles = cache.articles.filter(a => a.favorite).map(a => a.data);
        res.json({ articles });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET /news/search/:keyword - Search news articles by keyword
exports.searchNews = async (req, res) => {
    try {
        const userId = req.user.id;
        const keyword = req.params.keyword;
        const cache = await NewsCache.findOne({ userId });
        if (!cache) return res.json({ articles: [] });
        const articles = cache.articles.filter(a => {
            return a.data.title?.toLowerCase().includes(keyword.toLowerCase()) ||
                   a.data.description?.toLowerCase().includes(keyword.toLowerCase());
        }).map(a => a.data);
        res.json({ articles });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Periodic cache update (simulate real-time)
setInterval(async () => {
    try {
        const users = await User.find({});
        for (const user of users) {
            const { categories = [], languages = [] } = user.preferences || {};
            await fetchAndCacheNews(user._id, categories, languages);
        }
    } catch (err) {
        console.error('Periodic cache update error:', err);
    }
}, 15 * 60 * 1000); // Every 15 minutes
