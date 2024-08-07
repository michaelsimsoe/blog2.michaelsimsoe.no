import ArticlePreview from '../components/ArticlePreview.js';

customElements.define('article-preview', ArticlePreview);


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/posts.json');
        const posts = await response.json();
        const articleList = document.querySelector('.article-list');
        
        if (articleList) {
            posts.forEach((post: any) => {
                const articlePreview = document.createElement('article-preview') as ArticlePreview;
                articlePreview.data = post;
                articleList.appendChild(articlePreview);
            });
        }
    } catch (error) {
        console.error('Error fetching or displaying posts:', error);
    }
});
