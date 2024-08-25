const express = require('express');
const router = express.Router();
const pool = require('../index'); // Import the pool connection

// Add School API
router.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validate input data
    if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING id';
    pool.query(query, [name, address, latitude, longitude], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({ message: 'School added successfully', schoolId: result.rows[0].id });
    });
});

// List Schools API
router.get('/listSchools', (req, res) => {
    const { latitude, longitude } = req.query;

    if (typeof latitude !== 'string' || typeof longitude !== 'string') {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const query = `
        SELECT id, name, address, latitude, longitude, 
        (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) + sin(radians($1)) * sin(radians(latitude)))) AS distance 
        FROM schools 
        HAVING distance < 50 
        ORDER BY distance
    `;

    pool.query(query, [lat, lon, lat], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results.rows);
    });
});

module.exports = router;
















// const express = require('express');
// const router = express.Router();
// const db = require('../index'); 


// router.post('/addSchool', (req, res) => {
//     const { name, address, latitude, longitude } = req.body;

//     // Validate input data
//     if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
//         return res.status(400).json({ message: 'Invalid input data' });
//     }

//     const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
//     db.query(query, [name, address, latitude, longitude], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Database error', error: err });
//         }
//         res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
//     });
// });

// // List Schools API
// router.get('/listSchools', (req, res) => {
//     const { latitude, longitude } = req.query;

//     if (typeof latitude !== 'string' || typeof longitude !== 'string') {
//         return res.status(400).json({ message: 'Invalid input data' });
//     }

//     const lat = parseFloat(latitude);
//     const lon = parseFloat(longitude);

//     const query = 'SELECT id, name, address, latitude, longitude, ' +
//         '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance ' +
//         'FROM schools HAVING distance < 50 ORDER BY distance';

//     db.query(query, [lat, lon, lat], (err, results) => {
//         if (err) {
//             return res.status(500).json({ message: 'Database error', error: err });
//         }
//         res.json(results);
//     });
// });

// module.exports = router;
