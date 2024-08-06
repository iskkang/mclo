document.addEventListener('DOMContentLoaded', () => {
    loadDisasterMapData();
});

async function loadDisasterMapData() {
    const response = await fetch('/disaster-data');
    if (response.ok) {
        const data = await response.json();
        displayDisasterMap(data);
    } else {
        console.error('Failed to load disaster data');
    }
}

function displayDisasterMap(data) {
    const map = L.map('disastermap').setView([17.35344883620718, 5.734691], 1);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 날짜 기준으로 데이터 정렬
    data.sort((a, b) => new Date(b.Date) - new Date(a.Date));

    // 최근 10건의 데이터만 선택
    const recentData = data.slice(0, 10);

    recentData.forEach(item => {
        if (item.coord && item.coord.length === 2) {
            const marker = L.marker([item.coord[1], item.coord[0]], { 
                icon: L.icon({
                    iconUrl: item.icon || 'path/to/default/icon.png',
                    iconSize: [20, 20]
                })
            }).addTo(map);

            marker.bindPopup(`
                <h8>${item.title}</h8>
                <p>Level: ${item.level}</p>
                <p>Date: ${formatDate(item.Date)}</p>
                <p><a href="${item.report}" target="_blank">Report</a></p>
            `);
        }
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
}
