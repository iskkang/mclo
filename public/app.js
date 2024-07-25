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
    const scfiData = await fetchData('scfi');
    const portComparisonData = await fetchData('port-comparison');
    const portData = await fetchData('port-data');
    
    // SCFI Chart
    if (scfiData && scfiData.plots && scfiData.plots.length > 0) {
        const scfiPlot = scfiData.plots[0].data;
        const scfiDates = scfiPlot.map(item => item.Date);
        const scfiValues = scfiPlot.map(item => item.price);

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
    if (portComparisonData && portComparisonData.plots && portComparisonData.plots.length > 0) {
        const portPlot = portComparisonData.plots[0].data;
        const portNames = portPlot.map(item => item.name);
        const portValuesJune24 = portPlot.map(item => item['June 24']);
        const portValuesJune23 = portPlot.map(item => item['June 23']);

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
        const globalExportsPlot = globalExportsData.plots[0].data;
        const exportDates = globalExportsPlot.map(item => item.Date);
        const exportValues = globalExportsPlot.map(item => item.value);

        const exportsTrace = {
            x: exportDates,
            y: exportValues,
            type: 'bar',
            marker: { color: 'green' }
        };

        const exportsLayout = {
            title: 'Global Exports (TEU by Week)',
            xaxis: { title: 'Date' },
            yaxis: { title: 'TEU' }
        };

        Plotly.newPlot('globalTradeChart', [exportsTrace], exportsLayout);
    }

    // Port Data Chart
    if (portData && portData.plots && portData.plots.length > 0) {
        const portPlot = portData.plots[0].data;
        const portNames = portPlot.map(item => item.name);
        const portValues = portPlot.map(item => item.value);

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

    // Latest News
    const newsKeywords = ["해상운임", "항공운임", "철도", "물류", "Shipping"];
    const newsContainer = document.getElementById('newsContainer');
    for (const keyword of newsKeywords) {
        const newsResponse = await fetch(`https://news.google.com/search?q=${keyword}&hl=ko&gl=KR&ceid=KR:ko`);
        const newsHtml = await newsResponse.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(newsHtml, 'text/html');
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

document.addEventListener('DOMContentLoaded', renderCharts);
