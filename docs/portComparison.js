async function renderPortComparisonChart() {
    const portComparisonData = await fetchData('port-comparison');
    if (portComparisonData && portComparisonData.length > 0) {
        const portNames = portComparisonData.map(item => item.name);
        const portValues24 = portComparisonData.map(item => item['June 24']);
        const portValues23 = portComparisonData.map(item => item['June 23']);

        const portTrace24 = {
            y: portNames,  // x축을 y축으로 변경
            x: portValues24,  // y축을 x축으로 변경
            type: 'bar',
            name: '24',
            marker: { color: 'orange' },
            orientation: 'h'  // 수평 막대 그래프
        };

        const portTrace23 = {
            y: portNames,  // x축을 y축으로 변경
            x: portValues23,  // y축을 x축으로 변경
            type: 'bar',
            name: '23',
            marker: { color: 'blue' },
            orientation: 'h'  // 수평 막대 그래프
        };

        const portLayout = {
            title: '',
            xaxis: { title: 'Thousand TEU' },
            yaxis: { title: '' },
            barmode: 'group'
        };

        Plotly.newPlot('portComparisonChart', [portTrace24, portTrace23], portLayout);
    }
}
