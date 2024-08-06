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
    const fullYear = date.getFullYear();
    const year = fullYear === 2024 ? '24' : String(fullYear).slice(-2); // 연도의 마지막 두 자리만 가져오기
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`; // 연도, 월, 일을 표시
}

function displayDisasterData(data) {
    const tableBody = document.getElementById('disasterTableBody');
    tableBody.innerHTML = ''; // Clear existing rows
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.icon}" alt="icon" width="20" height="20"></td>
            <td>${item.title}</td>
            <td>${formatDate(item.Date)}</td>
            <td><a href="${item.report}" target="_blank">Report</a></td>
        `;
        tableBody.appendChild(row);
    });
    $('#disasterTable').DataTable();
}
