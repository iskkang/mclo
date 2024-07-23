const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Global Exports 데이터 가져오기
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

// SCFI 데이터 가져오기
const fetchScfi = async () => {
    const url = "https://www.econdb.com/widgets/shanghai-containerized-index/data/";
    const response = await axios.get(url);
    if (response.status === 200) {
        const data = response.data;
        if (data.plots && data.plots.length > 0) {
            return data.plots[0].data;
        }
    }
    return null;
};

// Top Port Comparison 데이터 가져오기
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

// 포트 데이터 가져오기
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

// 엔드포인트 설정
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
