document.addEventListener('DOMContentLoaded', () => {
    loadBDIData();
});

async function loadBDIData() {
    const response = await fetch('/data');
    if (response.ok) {
        const data = await response.json();
        displayBDIChart(data);
    } else {
        console.error('Failed to load BDI data');
    }
}

function displayBDIChart(data) {
    const ctx = document.getElementById('bdiChart').getContext('2d');
    const datasets = data.map(dataset => {
        return {
            label: dataset.title,
            data: dataset.data.map(item => ({ x: item[0], y: item[1] })),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false
        };
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'll',
                        displayFormats: {
                            day: 'YYYY-MM-DD'
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    });
}
