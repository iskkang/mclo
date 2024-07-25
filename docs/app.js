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
        const scfiDates = scfiData.map(item => item.Date);
        const scfiValues = scfiData.map(item => item.price);

        const scfiTrace = {
            x: scfiDates,
            y: scfiValues,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue' }
        };

        const scfiLayout = {
            title: 'Shanghai Containerized Freight Index (SCFI)',
            xaxis: { title: 'Date' },
            yaxis: { title: 'SCFI Value' }
        };

        Plotly.newPlot('scfiChart', [scfiTrace], scfiLayout);
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
    if (globalExportsData && globalExportsData.plots && globalExportsData.plots.length > 0) {
        const series = globalExportsData.plots[0].series;
        const data = globalExportsData.plots[0].data;
        const exportDates = data.map(item => item.Date);

        const traces = series.map(serie => ({
            x: exportDates,
            y: data.map(item => item[serie.code]),
            type: 'bar',
            name: serie.name,
            marker: { color: serie.color || 'random' },
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


    // Port Data Chart
    if (portData && portData.length > 0) {
        const portNames = portData.map(item => item.name);
        const portValues = portData.map(item => item.value);

        const portTrace = {
            x: portNames,
            y: portValues,
            type: 'bar',
            marker: { color: 'purple' }
        };

        const portLayout = {
            title: 'Port Data Overview',
            xaxis: { title: 'Port' },
            yaxis: { title: 'Value' }
        };

        Plotly.newPlot('portStatusChart', [portTrace], portLayout);
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
