async function renderPortComparisonChart() {
    const portComparisonData = await fetchData('port-comparison');
    if (portComparisonData && portComparisonData.length > 0) {
        const portNames = portComparisonData.map(item => item.name);
        const portValuesJune24 = portComparisonData.map(item => item['June 24']);
        const portValuesJune23 = portComparisonData.map(item => item['June 23']);

        const portTraceJune24 = {
            x: portValuesJune24,
            y: portNames,
            type: 'bar',
            name: 'June 24',
            marker: { color: 'orange' }
        };

        const portTraceJune23 = {
            x: portValuesJune23,
            y: portNames,
            type: 'bar',
            name: 'June 23',
            marker: { color: 'blue' }
        };

        const portLayout = {
            title: 'Top Port Comparison (June 24 vs June 23)',
            xaxis: { title: '' },
            yaxis: { title: '' },
            barmode: 'group'
        };

        Plotly.newPlot('portComparisonChart', [portTraceJune24, portTraceJune23], portLayout);
    }
}
