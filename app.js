const BASE_URL = 'https://port-0-mclo-lysc4ja0acad2542.sel4.cloudtype.app/';

async function fetchData(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (response.ok) {
            const data = await response.json();
            console.log(`${endpoint} data:`, data); // Check if data is correct
            return data;
        } else {
            console.error('Failed to fetch:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return null;
}

async function renderCharts() {
    // Fetch data
    const globalExportsData = await fetchData('global-exports');
    const scfiData = await fetchData('scfi');
    const portComparisonData = await fetchData('port-comparison');
    const portData = await fetchData('port-data');

    // Global Exports Chart
    const globalExportsCtx = document.getElementById('globalExportsChart').getContext('2d');
    new Chart(globalExportsCtx, {
        type: 'line',
        data: {
            labels: globalExportsData ? globalExportsData.map(item => item.Date) : [],
            datasets: [
                {
                    label: 'Africa',
                    data: globalExportsData ? globalExportsData.map(item => item.Africa) : [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true
                },
                {
                    label: 'East Asia',
                    data: globalExportsData ? globalExportsData.map(item => item['East Asia']) : [],
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    fill: true
                },
                {
                    label: 'Europe',
                    data: globalExportsData ? globalExportsData.map(item => item.Europe) : [],
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    fill: true
                }
            ]
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
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });

    // SCFI Chart
    const scfiCtx = document.getElementById('scfiChart').getContext('2d');
    new Chart(scfiCtx, {
        type: 'line',
        data: {
            labels: scfiData ? scfiData.map(item => item.Date) : [],
            datasets: [{
                label: 'Price',
                data: scfiData ? scfiData.map(item => item.price) : [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price'
                    }
                }
            }
        }
    });

    // Top Port Comparison Chart
    const portComparisonCtx = document.getElementById('portComparisonChart').getContext('2d');
    new Chart(portComparisonCtx, {
        type: 'bar',
        data: {
            labels: portComparisonData ? portComparisonData.map(item => item.name) : [],
            datasets: [
                {
                    label: 'June 24',
                    data: portComparisonData ? portComparisonData.map(item => item['June 24']) : [],
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                },
                {
                    label: 'June 23',
                    data: portComparisonData ? portComparisonData.map(item => item['June 23']) : [],
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Port'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'TEU'
                    }
                }
            }
        }
    });

    // Port Data Chart
    const portDataCtx = document.getElementById('portDataChart').getContext('2d');
    new Chart(portDataCtx, {
        type: 'doughnut',
        data: {
            labels: portData ? portData.map(item => item.name) : [],
            datasets: [{
                label: 'Global Trade',
                data: portData ? portData.map(item => item.global_trade) : [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

document.addEventListener('DOMContentLoaded', renderCharts);
