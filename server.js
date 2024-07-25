const http = require('http');
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv').config();
const fs = require('fs');

const { GoogleGenerativeAIA, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

// Initialize the app
const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
let corsOptions = {
    origin: '*',
    // credentials: true
};

app.use(cors(corsOptions));

// Serve static files from the "docs" directory
app.use(express.static(path.join(__dirname, 'docs')));
app.use(express.json());

// Serve index.html for all routes to support client-side routing
app.get('*', (req, res) => {
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Date': Date.now()
    });
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:3000${port}`);
});
