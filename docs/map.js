function initializeMap() {
    var map = L.map('map').setView([17.35344883620718, 5.734691], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 12,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Fetch port map data and add markers
    fetchPortMapData().then(portMapData => {
        if (portMapData && portMapData.length > 0) {
            var portIcon = L.icon({
                iconUrl: 'port-top.png',
                iconSize: [20, 20], // size of the icon
                iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -15] // point from which the popup should open relative to the iconAnchor
            });

            portMapData.forEach(item => {
                const marker = L.marker(item.coord.split(',').map(Number), { icon: portIcon }).addTo(map);
                marker.bindPopup(`
                    <h4>${item.name}</h4>
                    <p>Country: ${item.country}</p>
                    <p>Rank: ${item.rank}</p>
                `);
            });
        }
    });
}

async function fetchPortMapData() {
    try {
        const response = await fetch('/port-map');
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Failed to fetch port map data:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return null;
}