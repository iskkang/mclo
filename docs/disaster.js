document.addEventListener('DOMContentLoaded', () => {
    loadDisasterData();
});

async function loadDisasterData() {
    const response = await fetch('/disaster-data');
    if (response.ok) {
        const data = await response.json();
        displayDisasterData(data);
    } else {
        console.error('Failed to load disaster data');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function displayDisasterData(data) {
    const tableBody = document.getElementById('disasterTableBody');
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.icon}" alt="icon" width="30" height="30"></td>
            <td>${item.level}</td>
            <td>${item.title}</td>
            <td>${item.Date}</td>
            <td><a href="${item.report}" target="_blank">Report</a></td>
        `;
        tableBody.appendChild(row);
    });
    $('#disasterTable').DataTable();
}
