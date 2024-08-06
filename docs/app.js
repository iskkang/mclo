document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    renderSCFIChart();
    renderPortComparisonChart();
    renderGlobalExportsChart();
    renderPortDataTable();
    loadNews('해상운임'); // Load initial news category
});

async function fetchData(endpoint) {
    const BASE_URL = 'https://port-0-mclo-lysc4ja0acad2542.sel4.cloudtype.app/';
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Failed to fetch:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return null;
}

async function fetchPortDetails(locode) {
    try {
        const response = await fetch(`https://www.econdb.com/maritime/ports/async/${encodeURIComponent(locode)}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Failed to fetch port details:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return null;
}