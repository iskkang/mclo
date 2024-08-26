async function fetchData() {
    try {
        const response = await fetch('https://www.econdb.com/widgets/portcall-timeliness/data/');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Failed to fetch data:', error);
        return null;
    }
}

function filterDataByDate(data, startDate) {
    return data.filter(item => new Date(item.Date) >= new Date(startDate));
}

function renderChart(chartData) {
    const chartContainer = document.getElementById('delay-chart');
    const chart = echarts.init(chartContainer);

    const seriesData = [
        {
            name: 'Previous delays',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            data: chartData.map(item => item['Previous delays'])
        },
        {
            name: 'Port operational reasons',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            data: chartData.map(item => item['Port operational reasons'])
        },
        {
            name: 'Weather',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            data: chartData.map(item => item['Weather'])
        },
        {
            name: 'Others',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            data: chartData.map(item => item['Others'])
        },
        {
            name: 'On time',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            data: chartData.map(item => item['On time'])
        }
    ];

    const option = {

        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                let result = `${params[0].name}<br/>`;
                params.forEach(param => {
                    result += `${param.marker} ${param.seriesName}: ${param.value.toFixed(2)}%<br/>`;
                });
                return result;
            }
        },
        legend: {
            data: ['Previous delays', 'Port operational', 'Weather', 'Others', 'On time']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chartData.map(item => item['Date'])
        },
        yAxis: {
            type: 'value',
            max: 100 // Set the maximum value of the yAxis to 100
        },
        series: seriesData
    };

    chart.setOption(option);
}

document.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchData();
    if (data && data.plots && data.plots[0].data) {
        // Filter data from 2023-01-01 onward
        const filteredData = filterDataByDate(data.plots[0].data, '2023-01-01');
        renderChart(filteredData);
    } else {
        console.error('Failed to load chart data');
    }
});
