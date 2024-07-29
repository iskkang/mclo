let currentKeyword = '';
let currentPage = 1;
const articlesPerPage = 5;

async function fetchNews(keyword) {
    const url = `/api/news?q=${keyword}&hl=ko&gl=KR&ceid=KR:ko`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc;
        }
    } catch (error) {
        console.error('Failed to fetch news:', error);
    }
    return null;
}

async function loadNews(keyword) {
    currentKeyword = keyword;
    currentPage = 1;
    const doc = await fetchNews(keyword);
    displayNews(doc);
}

async function loadMoreNews() {
    currentPage += 1;
    const doc = await fetchNews(currentKeyword);
    displayNews(doc, true);
}

function displayNews(doc, append = false) {
    const articles = Array.from(doc.querySelectorAll('article'));
    const newsContainer = document.getElementById('newsContainer');
    if (!append) {
        newsContainer.innerHTML = '';
    }
    const start = (currentPage - 1) * articlesPerPage;
    const end = currentPage * articlesPerPage;
    articles.slice(start, end).forEach(article => {
        const source = article.querySelector('.vr1PYe')?.textContent || 'No Source';
        const titleTag = article.querySelector('a.JtKRv');
        const title = titleTag?.textContent || 'No Title';
        const link = titleTag ? 'https://news.google.com' + titleTag.getAttribute('href').substring(1) : 'No Link';
        const thumbnailTag = article.querySelector('img.Quavad');
        const thumbnail = thumbnailTag ? (thumbnailTag.src.startsWith('/') ? 'https://news.google.com' + thumbnailTag.src : thumbnailTag.src) : 'https://via.placeholder.com/300x150?text=No+Image';
        const dateTag = article.querySelector('time.hvbAAd');
        const date = dateTag ? dateTag.getAttribute('datetime') : 'No Date';

        const newsHtml = `
            <div class="table">
            <tr>
                <th><b>${title}</b></th>
                <th>출처: ${source}</th>
                <th>날짜: ${date}</th>
                <th><a href="${link}" target="_blank">기사 읽기</a></th>
             </tr>
            </div>
        `;
        newsContainer.innerHTML += newsHtml;
    });
    const moreButton = document.getElementById('moreButton');
    if (articles.length > end) {
        moreButton.style.display = 'block';
    } else {
        moreButton.style.display = 'none';
    }
}
