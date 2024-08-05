async function renderPortComparisonChart() {
    const url = "https://www.econdb.com/widgets/top-port-comparison/data/";
    const portComparisonData = await fetchData(url);
    
    if (portComparisonData && portComparisonData.length > 0) {
        const portNames = portComparisonData.map(item => item.name);
        const portValuesJune24 = portComparisonData.map(item => parseFloat(item['June 24']));
        const portValuesJune23 = portComparisonData.map(item => parseFloat(item['June 23']));

        const portTraceJune24 = {
            y: portNames,
            x: portValuesJune24,
            type: 'bar',
            orientation: 'h',
            name: 'June 24',
            marker: { color: 'orange' }
        };

        const portTraceJune23 = {
            y: portNames,
            x: portValuesJune23,
            type: 'bar',
            orientation: 'h',
            name: 'June 23',
            marker: { color: 'blue' }
        };

        const portLayout = {
            title: '',
            xaxis: { title: 'Thousand TEU' },
            yaxis: { title: 'Port' },
            barmode: ''
        };

        Plotly.newPlot('portComparisonChart', [portTraceJune24, portTraceJune23], portLayout);
    }
}

renderPortComparisonChart();
