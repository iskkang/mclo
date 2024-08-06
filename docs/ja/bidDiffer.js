document.addEventListener('DOMContentLoaded', () => {
    loadDifferData();
});

async function loadDifferData() {
    const types = ['bdi', 'hrci', 'scfi', 'kcci', 'kdci'];
    const differContainer = document.getElementById('differContainer');

    for (const type of types) {
        try {
            const response = await fetch(`/data/${type}`);
            if (response.ok) {
                const dataset = await response.json();
                console.log(`Data for ${type}:`, dataset); // 콘솔에 데이터 출력
                if (dataset) {
                    displayDifference(differContainer, dataset);
                } else {
                    console.error(`No data found for ${type}`);
                }
            } else {
                console.error(`Failed to load data for ${type}`);
            }
        } catch (error) {
            console.error(`Error fetching data for ${type}:`, error);
        }
    }
}

function displayDifference(container, dataset) {
    const div = document.createElement('div');
    div.className = 'differ col-md-4';
    div.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${dataset.title}</h5>
                <p class="card-text">Difference: ${dataset.finalDifference !== null ? dataset.finalDifference : 'N/A'}</p>
            </div>
        </div>
    `;
    container.appendChild(div);
}
