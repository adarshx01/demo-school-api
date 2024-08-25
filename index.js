// index.js

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mysql = require('mysql2');

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});

// Export the db connection
module.exports = db;

// Routes
app.use('/api/schools', require('./routes/schools'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
