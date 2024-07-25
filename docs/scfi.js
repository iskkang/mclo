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
            title: 'Shanghai Containerized Freight Index (SCFI)',
            xaxis: { title: 'Date' },
            yaxis: { title: 'SCFI Value' }
        };

        Plotly.newPlot('scfiChart', traces, scfiLayout);

        // Display footnote
        const footnoteElement = document.createElement('div');
        footnoteElement.innerText = footnote;
        document.getElementById('scfiChart').appendChild(footnoteElement);
    }
}
