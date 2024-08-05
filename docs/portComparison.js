async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.plots[0].data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return null;
    }
}

async function renderPortComparisonChart() {
    const url = "https://www.econdb.com/widgets/top-port-comparison/data/";
    const portComparisonData = await fetchData(url);
    
    if (portComparisonData && portComparisonData.length > 0) {
        const portNames = portComparisonData.map(item => item.name);
        const portValuesJune24 = portComparisonData.map(item => parseFloat(item['June 24']));
        const portValuesJune23 = portComparisonData.map(item => parseFloat(item['June 23']));

        const portTraceJune24 = {
            x: portValuesJune24,
            y: portNames,
            type: 'bar',
            orientation: 'h',
            name: 'June 24',
            marker: { color: 'orange' }
        };

        const portTraceJune23 = {
            x: portValuesJune23,
            y: portNames,
            type: 'bar',
            orientation: 'h',
            name: 'June 23',
            marker: { color: 'blue' }
        };

        const portLayout = {
            title: 'Top Port Comparison (June 24 vs June 23)',
            xaxis: { title: 'Thousand TEU' },
            yaxis: { title: 'Port' },
            barmode: 'group'
        };

        Plotly.newPlot('portComparisonChart', [portTraceJune24, portTraceJune23], portLayout);
    }
}

renderPortComparisonChart();
