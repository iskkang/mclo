async function renderGlobalExportsChart() {
    const globalExportsData = await fetchData('global-exports');
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
}
