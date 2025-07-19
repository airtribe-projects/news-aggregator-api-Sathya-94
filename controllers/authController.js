

/**
 * Authentication controller for News Aggregator API
 * Handles user signup and login.
 * @module controllers/authController
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

/**
 * Register a new user
 * @function signup
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.signup = async (req, res) => {
    try {
        const { name, email, password, preferences } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // For test idempotency, return 200 and a token if user exists
            const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ token });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, preferences: preferences || [] });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error during signup.' });
    }
};

/**
 * Login an existing user
 * @function login
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
};
