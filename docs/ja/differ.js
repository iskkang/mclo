document.addEventListener('DOMContentLoaded', () => {
    loadDifferData('scfi');
    loadDifferData('bdi');
});

async function loadDifferData(type) {
    try {
        const response = await fetch(`/data/${type}`);
        if (response.ok) {
            const dataset = await response.json();
            displayDifference(type, dataset);
        } else {
            console.error(`Failed to load data for ${type}`);
        }
    } catch (error) {
        console.error(`Error fetching data for ${type}:`, error);
    }
}

function displayDifference(type, data) {
    const difference = data.finalDifference !== null ? data.finalDifference.toFixed(2) : 'N/A';

    const latestValueElem = document.querySelector(`#${type}Difference .latest-value`);
    const trendIcon = document.querySelector(`#${type}Difference .icon`);

    if (latestValueElem && trendIcon) {
        latestValueElem.textContent = difference;

        if (data.finalDifference > 0) {
            trendIcon.classList.add('tx-success', 'ion-md-trending-up');
            trendIcon.classList.remove('tx-danger', 'ion-md-trending-down');
        } else {
            trendIcon.classList.add('tx-danger', 'ion-md-trending-down');
            trendIcon.classList.remove('tx-success', 'ion-md-trending-up');
        }
    }
}
