async function renderPortDataTable() {
    const portDataResponse = await fetchData('port-data');
    if (portDataResponse && portDataResponse.length > 0) {
        const portData = portDataResponse;
        const tableBody = document.getElementById('portTableBody');
        portData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.rank}</td>
                <td>${item.name}</td>
                <td>${item.last_import_teu.toLocaleString()}</td>
                <td>${item.last_export_teu?.toLocaleString() || 'N/A'}</td>
                <td>${item.last_import_teu_mom?.toFixed(1) || 'N/A'}%</td>
                <td>${item.last_export_teu_mom?.toFixed(1) || 'N/A'}%</td>
                <td>${item.transshipments.toFixed(1)}</td>
                <td>${item.vessels_berthed}</td>
                <td>${item.delay_percent.toFixed(1)}%</td>
                <td>${item.import_dwell_time.toFixed(1)}</td>
                <td>${item.export_dwell_time.toFixed(1)}</td>
                <td>${item.ts_dwell_time.toFixed(1)}</td>
            `;
            tableBody.appendChild(row);
        });
        $('#portTable').DataTable();
    }
}
