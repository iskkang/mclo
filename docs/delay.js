document.addEventListener('DOMContentLoaded', () => {
    loadDelayChart();
});

async function fetchDelayData() {
    const url = 'https://www.econdb.com/widgets/portcall-timeliness/data/';
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.plots[0];  // Access the first plot, which contains the time series data
        } else {
            console.error('Failed to fetch data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching delay data:', error);
    }
    return null;
}

async function loadDelayChart() {
    const delayData = await fetchDelayData();
    if (!delayData) return;

    const labels = delayData.data.map(item => item.Date);  // Dates for the x-axis
    const series = delayData.series;

    // Prepare the datasets for Chart.js
    const datasets = series.map((seriesItem) => {
        return {
            label: seriesItem.name,
            data: delayData.data.map(item => item[seriesItem.code]),  // Extract data for each series
            backgroundColor: getColorByName(seriesItem.name),  // Assign a color to each series
            fill: true,
        };
    });

    // Create the chart
    const ctx = document.getElementById('delayChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',  // Use 'line' type for stacked area chart
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    stacked: true,  // Stack the datasets
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    },
                    ticks: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });
}

// Helper function to assign a color based on the series name
function getColorByName(name) {
    const colors = {
        'Previous delays': 'rgba(255, 99, 132, 0.5)',  // red
        'Port operational reasons': 'rgba(255, 159, 64, 0.5)',  // orange
        'Weather': 'rgba(75, 192, 192, 0.5)',  // green
        'Others': 'rgba(54, 162, 235, 0.5)',  // blue
        'On time': 'rgba(153, 102, 255, 0.5)'  // purple
    };
    return colors[name] || 'rgba(0, 0, 0, 0.5)';  // Default color (black) if no match
}
