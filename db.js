
/**
 * MongoDB connection utility for News Aggregator API
 * Connects to the database using the MONGODB_URI from environment variables.
 * @module db
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
