const mongoose = require('mongoose');

const newsCacheSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    articles: [
        {
            articleId: { type: String, required: true }, // NewsAPI article id or url
            data: { type: Object, required: true },
            read: { type: Boolean, default: false },
            favorite: { type: Boolean, default: false }
        }
    ],
    lastUpdated: { type: Date, default: Date.now }
});

const NewsCache = mongoose.model('NewsCache', newsCacheSchema);

module.exports = NewsCache;
