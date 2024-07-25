const BASE_URL = 'https://port-0-mclo-lysc4ja0acad2542.sel4.cloudtype.app/';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

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
    const scfiData = await fetchData('scfi');
    const portComparisonData = await fetchData('port-comparison');
    const portData = await fetchData('port-data');
    
    // SCFI Chart
    if (scfiData && scfiData.length > 0) {
        const series = [
            {code: "price", name: "Future (prompt month)", color: "red"},
            {code: "SCSFI_EU", name: "Observed", color: "green"},
            {code: "Forward curve", name: "Forward curve (Jul-24)", color: "blue"},
            {code: "wkago", name: "Forward curve (Jul-17)", color: "orange"}
        ];
        
        const scfiDates = scfiData.map(item => item.Date);
        
        const traces = series.map(serie => ({
            x: scfiDates,
            y: scfiData.map(item => item[serie.code]),
            type: 'scatter',
            mode: 'lines+markers',
            name: serie.name,
            marker: { color: serie.color }
        }));
        
        const scfiLayout = {
            title: 'Shanghai Containerized Freight Index (SCFI)',
            xaxis: { title: 'Date' },
            yaxis: { title: 'SCFI Value' }
        };

        Plotly.newPlot('scfiChart', traces, scfiLayout);
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
            hoverinfo: 'x+y',
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
    if (portData && portData.length > 0) {
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
                <td>${item.turnaround}</td>
                <td>${item.transshipments.toFixed(1)}</td>
                <td>${item.vessels_berthed}</td>
                <td>${item.port_congestion}</td>
                <td>${item.schedule}</td>
                <td>${item.delay_percent.toFixed(1)}%</td>
                <td>${item.import_dwell_time.toFixed(1)}</td>
                <td>${item.export_dwell_time.toFixed(1)}</td>
                <td>${item.ts_dwell_time.toFixed(1)}</td>
            `;
            tableBody.appendChild(row);
        });
        $('#portTable').DataTable();
    }
}

async function fetchNews(keyword) {
    const url = `${CORS_PROXY}https://news.google.com/search?q=${keyword}&hl=ko&gl=KR&ceid=KR:ko`;
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

async function renderNews() {
    const newsKeywords = ["해상운임", "항공운임", "철도", "물류", "Shipping"];
    const newsContainer = document.getElementById('newsContainer');
    for (const keyword of newsKeywords) {
        const doc = await fetchNews(keyword);
        if (doc) {
            const articles = doc.querySelectorAll('article');
            articles.forEach(article => {
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
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCharts();
    renderNews();
});
