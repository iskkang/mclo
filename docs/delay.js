document.addEventListener('DOMContentLoaded', () => {
    loadDelayChart();
});

async function fetchDelayData() {
    const url = 'https://www.econdb.com/widgets/portcall-timeliness/data/';
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
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

    // Example processing of data (adjust according to actual JSON structure)
    const categories = delayData.x_axis;  // X-axis labels (e.g., years)
    const seriesData = delayData.series;  // Y-axis series (e.g., delay reasons)

    // Prepare the datasets for Chart.js
    const datasets = seriesData.map((series, index) => ({
        label: series.name,
        data: series.data,
        backgroundColor: getColorByIndex(index),  // Function to get colors for each dataset
        fill: true,
    }));

    // Create the chart
    const ctx = document.getElementById('delayChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',  // Use 'line' type for stacked area chart
        data: {
            labels: categories,
            datasets: datasets,
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    stacked: true,
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

// Helper function to get color by index for each dataset
function getColorByIndex(index) {
    const colors = [
        'rgba(255, 99, 132, 0.5)',  // red for 'Previous delays'
        'rgba(255, 159, 64, 0.5)',  // orange for 'Port operational reasons'
        'rgba(75, 192, 192, 0.5)',  // green for 'Weather'
        'rgba(54, 162, 235, 0.5)',  // blue for 'Others'
        'rgba(153, 102, 255, 0.5)', // purple for 'On time'
    ];
    return colors[index % colors.length];
}
