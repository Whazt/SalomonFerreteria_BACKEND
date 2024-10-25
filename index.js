// index.js

require('dotenv').config(); // Load environment variables
const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based MySQL

const app = express();
const PORT = process.env.PORT || 3000;

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB
});

// Test the database connection
pool.getConnection()
    .then(connection => {
        console.log('Connected to the database.');
        connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

// Root route
app.get('/', (req, res) => {
    res.send('Hola'); // Responds with "Hola" at the root URL
});

// Route for fetching products
app.get('/api/productos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Productos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
