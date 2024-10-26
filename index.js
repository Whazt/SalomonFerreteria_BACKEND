// index.js

require('dotenv').config(); // Load environment variables
const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based MySQL
const axios = require('axios'); // Para consumir la API de Python
const { exec } = require('child_process');

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
app.get('/api/prediccion', (req, res) => {
    exec('python ia/ventas_predict.py', (error, stdout, stderr) => {
        // Manejo de errores
        if (error) {
            console.error(`Error al ejecutar Python: ${stderr}`);
            console.error(`Código de error: ${error.code}`);
            return res.status(500).json({ error: 'Error al generar informe' });
        }

        // Imprimir la salida del script para depuración
        console.log(stdout); 

        try {
            const informe = JSON.parse(stdout);
            res.json(informe);
        } catch (parseError) {
            console.error(`Error al analizar JSON: ${parseError.message}`);
            return res.status(500).json({ error: 'Error al procesar la respuesta' });
        }
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});