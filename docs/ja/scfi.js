async function renderSCFIChart() {
    const scfiDataResponse = await fetchData('scfi');
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
            xaxis: { title: '' },
            yaxis: { title: '' }
        };

        Plotly.newPlot('scfiChart', traces, scfiLayout);


    }
}
