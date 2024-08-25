const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { Pool } = require('pg'); // Use 'pg' package

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test the db if connected
pool.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});

// Export the pool for use in other files
module.exports = pool;

// Routes
app.use('/api/schools', require('./routes/schools'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});














// const express = require('express');
// const app = express();
// const dotenv = require('dotenv');
// const mysql = require('mysql2');


// dotenv.config();


// app.use(express.json());


// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// db.connect((err) => {
//     if (err) {
//         console.error('Database connection failed:', err.stack);
//         return;
//     }
//     console.log('Connected to database');
// });

// module.exports = db;

// // Routes
// app.use('/api/schools', require('./routes/schools'));

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
