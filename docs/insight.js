async function fetchNewsArticles() {
    try {
        const targetUrl = 'https://www.haesainfo.com/news/articleList.html?sc_section_code=S1N12&view_type=sm';

        // Fetch the HTML content from the target URL
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();

        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract the top 5 news articles from the document
        const articles = doc.querySelectorAll('#section-list ul.type1 li');
        const topArticles = [];

        articles.forEach((article, index) => {
            if (index < 5) {
                const titleElement = article.querySelector('h4.titles a');
                const title = titleElement.textContent.trim();
                const link = 'https://www.haesainfo.com' + titleElement.getAttribute('href');
                const dateElement = article.querySelector('em.info.dated');
                const date = dateElement.textContent.trim();

                topArticles.push({ title, link, date });
            }
        });

        return topArticles;

    } catch (error) {
        console.error('Failed to fetch news articles:', error);
        return [];
    }
}

function renderNewsArticles(newsData) {
    const newsContainer = document.querySelector('#news-articles');

    newsContainer.innerHTML = ''; // Clear any previous content

    newsData.forEach(news => {
        const articleElement = document.createElement('div');
        articleElement.className = 'row g-0 align-items-center py-2 position-relative border-bottom border-200';

        articleElement.innerHTML = `
            <div class="col ps-x1 py-1 position-static">
                <div class="d-flex align-items-center">
                    <div class="flex-1">
                        <h6 class="mb-0 d-flex align-items-center">
                            <a class="text-800 stretched-link" href="${news.link}" target="_blank">${news.title}</a>
                        </h6>
                        <p class="text-500 fs-11 mb-0">${news.date}</p>
                    </div>
                </div>
            </div>
        `;

        newsContainer.appendChild(articleElement);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const newsData = await fetchNewsArticles();
    if (newsData.length > 0) {
        renderNewsArticles(newsData);
    }
});
