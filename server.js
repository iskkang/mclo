const http = require('http');
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const { GoogleGenerativeAIA, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

// Initialize the app
const app = express();
const port = process.env.PORT || 4000; // Changed port to 4000

// CORS configuration
let corsOptions = {
    origin: '*',
    // credentials: true
};

app.use(cors(corsOptions));

// Serve static files from the "docs" directory
app.use(express.static(path.join(__dirname, 'docs')));
app.use(express.json());

// Fetch data functions
const fetchGlobalExports = async () => {
    const url = "https://www.econdb.com/widgets/global-trade/data/?type=export&net=0&transform=0";
    const response = await axios.get(url);
    if (response.status === 200) {
        const data = response.data;
        if (data.plots && data.plots.length > 0) {
            return data.plots[0].data;
        }
    }
    return null;
};

const fetchScfi = async () => {
    const url = "https://www.econdb.com/widgets/shanghai-containerized-index/data/";
    const response = await axios.get(url);
    if (response.status === 200) {
        const data = response.data;
        const series = response.series;
        const footnote = response.footnote;
        if (data.plots && data.plots.length > 0) {
            return data.plots[0].data;
        }
    }
    return null;
};

const fetchPortComparison = async () => {
    const url = "https://www.econdb.com/widgets/top-port-comparison/data/";
    const response = await axios.get(url);
    if (response.status === 200) {
        const data = response.data;
        if (data.plots && data.plots.length > 0) {
            return data.plots[0].data;
        }
    }
    return null;
};

const fetchPortData = async () => {
    const url = "https://www.econdb.com/maritime/search/ports/?ab=-62.933895117588925%2C-138.84538637063213%2C75.17530232751466%2C150.31476987936844&center=17.35344883620718%2C5.734691754366622";
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    };
    const response = await axios.get(url, { headers });
    if (response.status === 200) {
        return response.data.response.docs;
    }
    return null;
};

// Endpoints for data fetching
app.get('/global-exports', async (req, res) => {
    const data = await fetchGlobalExports();
    res.json(data);
});

app.get('/scfi', async (req, res) => {
    const data = await fetchScfi();
    res.json(data);
});

app.get('/port-comparison', async (req, res) => {
    const data = await fetchPortComparison();
    res.json(data);
});

app.get('/port-data', async (req, res) => {
    const data = await fetchPortData();
    res.json(data);
});

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
    console.log(`Server is running on http://localhost:${port}`);
});
