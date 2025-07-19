require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);


// Preferences routes
const preferencesRoutes = require('./routes/preferences');
app.use('/', preferencesRoutes);

// News routes
const newsRoutes = require('./routes/news');
app.use('/', newsRoutes);

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(port, (err) => {
        if (err) {
            return console.log('Something bad happened', err);
        }
        console.log(`Server is listening on ${port}`);
    });
});

module.exports = app;
