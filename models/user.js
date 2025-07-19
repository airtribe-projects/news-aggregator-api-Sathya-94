
/**
 * User model schema for News Aggregator API
 * Stores user details and preferences.
 * @module models/user
 */

const mongoose = require('mongoose');

/**
 * Mongoose schema for User
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    preferences: [{ type: String }]
});

/**
 * Mongoose User model
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
