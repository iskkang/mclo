async function renderPortComparisonChart() {
    const portComparisonData = await fetchData('port-comparison');
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
}
