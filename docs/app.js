const BASE_URL = 'https://port-0-mclo-lysc4ja0acad2542.sel4.cloudtype.app/';

async function fetchData(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Failed to fetch:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return null;
}

async function renderCharts() {
    const globalExportsData = await fetchData('global-exports');
    const scfiDataResponse = await fetchData('scfi');
    const portComparisonData = await fetchData('port-comparison');
    const portDataResponse = await fetchData('port-data');
    const portMapData = await fetchData('port-map');

    // SCFI Chart
    if (scfiDataResponse && scfiDataResponse.data && scfiDataResponse.data.length > 0) {
        const scfiData = scfiDataResponse.data;
        const series = scfiDataResponse.series;
        const footnote = scfiDataResponse.footnote;

        const scfiDates = scfiData.map(item => item.Date);

        const traces = series.map(serie => ({
            x: scfiDates,
            y: scfiData.map(item => item[serie.code]),
            type: 'scatter',
            mode: 'lines+markers',
            name: serie.name
        }));

        const scfiLayout = {
            title: 'Shanghai Containerized Freight Index (SCFI)',
            xaxis: { title: 'Date' },
            yaxis: { title: 'SCFI Value' }
        };

        Plotly.newPlot('scfiChart', traces, scfiLayout);

        // Display footnote
        const footnoteElement = document.createElement('div');
        footnoteElement.innerText = footnote;
        document.getElementById('scfiChart').appendChild(footnoteElement);
    }

    // Port Comparison Chart
    if (portComparisonData && portComparisonData.length > 0) {
        const portNames = portComparisonData.map(item => item.name);
        const portValuesJune24 = portComparisonData.map(item => item['June 24']);
        const portValuesJune23 = portComparisonData.map(item => item['June 23']);

        const portTraceJune24 = {
            x: portNames,
            y: portValuesJune24,
            type: 'bar',
            name: 'June 24',
            marker: { color: 'orange' }
        };

        const portTraceJune23 = {
            x: portNames,
            y: portValuesJune23,
            type: 'bar',
            name: 'June 23',
            marker: { color: 'blue' }
        };

        const portLayout = {
            title: 'Top Port Comparison (June 24 vs June 23)',
            xaxis: { title: 'Port' },
            yaxis: { title: 'Thousand TEU' },
            barmode: 'group'
        };

        Plotly.newPlot('portComparisonChart', [portTraceJune24, portTraceJune23], portLayout);
    }

    // Global Exports Chart
    if (globalExportsData && globalExportsData.length > 0) {
        const exportDates = globalExportsData.map(item => item.Date);
        const regions = Object.keys(globalExportsData[0]).filter(key => key !== 'Date');

        const traces = regions.map(region => ({
            x: exportDates,
            y: globalExportsData.map(item => item[region]),
            type: 'bar',
            name: region,
            hoverinfo: 'x+y'
        }));

        const exportsLayout = {
            title: 'Global Exports (TEU by Week)',
            xaxis: { title: 'Date' },
            yaxis: { title: 'TEU' },
            barmode: 'stack',
            hovermode: 'closest',
            showlegend: true
        };

        Plotly.newPlot('globalTradeChart', traces, exportsLayout);
    } else {
        console.error('Invalid globalExportsData structure:', globalExportsData);
    }

    // Port Data Table
    if (portDataResponse && portDataResponse.length > 0) {
        const portData = portDataResponse;
        const tableBody = document.getElementById('portTableBody');
        portData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.rank}</td>
                <td>${item.name}</td>
                <td>${item.locode}</td>
                <td>${item.last_import_teu.toLocaleString()}</td>
                <td>${item.last_export_teu?.toLocaleString() || 'N/A'}</td>
                <td>${item.last_import_teu_mom?.toFixed(1) || 'N/A'}%</td>
                <td>${item.last_export_teu_mom?.toFixed(1) || 'N/A'}%</td>
                <td>${item.transshipments.toFixed(1)}</td>
                <td>${item.vessels_berthed}</td>
                <td>${item.delay_percent.toFixed(1)}%</td>
                <td>${item.import_dwell_time.toFixed(1)}</td>
                <td>${item.export_dwell_time.toFixed(1)}</td>
                <td>${item.ts_dwell_time.toFixed(1)}</td>
            `;
            tableBody.appendChild(row);
        });
        $('#portTable').DataTable();
    }

    // Initialize Leaflet map and add markers
    initializeMap(portMapData);
}

function initializeMap(portMapData) {
    var map = L.map('map').setView([51.505, -0.09], 3);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 12,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Add port icons
    if (portMapData && portMapData.length > 0) {
        portMapData.forEach(item => {
            const marker = L.marker(item.coord.split(',').map(Number)).addTo(map);
            marker.bindPopup(`
                <h4>${item.name}</h4>
                <p>Country: ${item.country}</p>
                <p>Rank: ${item.rank}</p>
            `);
        });
    }
}

async function fetchPortDetails(locode) {
    try {
        const response = await fetch(`https://www.econdb.com/maritime/ports/async/${encodeURIComponent(locode)}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Failed to fetch port details:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return null;
}

let currentKeyword = '';
let currentPage = 1;
const articlesPerPage = 5;

async function fetchNews(keyword) {
    const url = `/api/news?q=${keyword}&hl=ko&gl=KR&ceid=KR:ko`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc;
        }
    } catch (error) {
        console.error('Failed to fetch news:', error);
    }
    return null;
}

async function loadNews(keyword) {
    currentKeyword = keyword;
    currentPage = 1;
    const doc = await fetchNews(keyword);
    displayNews(doc);
}

async function loadMoreNews() {
    currentPage += 1;
    const doc = await fetchNews(currentKeyword);
    displayNews(doc, true);
}

function displayNews(doc, append = false) {
    const articles = Array.from(doc.querySelectorAll('article'));
    const newsContainer = document.getElementById('newsContainer');
    if (!append) {
        newsContainer.innerHTML = '';
    }
    const start = (currentPage - 1) * articlesPerPage;
    const end = currentPage * articlesPerPage;
    articles.slice(start, end).forEach(article => {
        const source = article.querySelector('.vr1PYe')?.textContent || 'No Source';
        const titleTag = article.querySelector('a.JtKRv');
        const title = titleTag?.textContent || 'No Title';
        const link = titleTag ? 'https://news.google.com' + titleTag.getAttribute('href').substring(1) : 'No Link';
        const thumbnailTag = article.querySelector('img.Quavad');
        const thumbnail = thumbnailTag ? (thumbnailTag.src.startsWith('/') ? 'https://news.google.com' + thumbnailTag.src : thumbnailTag.src) : 'https://via.placeholder.com/300x150?text=No+Image';
        const dateTag = article.querySelector('time.hvbAAd');
        const date = dateTag ? dateTag.getAttribute('datetime') : 'No Date';

        const newsHtml = `
            <div class="card">
                <img src="${thumbnail}" alt="${title}">
                <h4><b>${title}</b></h4>
                <p>출처: ${source}</p>
                <p>날짜: ${date}</p>
                <a href="${link}" target="_blank">기사 읽기</a>
            </div>
        `;
        newsContainer.innerHTML += newsHtml;
    });
    const moreButton = document.getElementById('moreButton');
    if (articles.length > end) {
        moreButton.style.display = 'block';
    } else {
        moreButton.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCharts();
    loadNews('해상운임'); // Load initial news category
});
