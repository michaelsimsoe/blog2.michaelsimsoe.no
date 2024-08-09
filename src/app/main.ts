// import ArticlePreview from '../components/ArticlePreview.js';

// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         const response = await fetch('/posts.json');
//         const posts = await response.json();
//         const articleList = document.querySelector('.article-list');

//         if (articleList) {
//             posts.forEach((post: any) => {
//                 const articlePreview = document.createElement('article-preview') as ArticlePreview;
//                 articlePreview.data = post;
//                 articleList.appendChild(articlePreview);
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching or displaying posts:', error);
//     }
// });
console.log("main.ts loaded");

document.addEventListener("DOMContentLoaded", async () => {
  window.addEventListener("pageswap", (event) => {
    console.log("Page swap event:", event);
  });

  window.addEventListener("pagereveal", (event) => {
    console.log("Page reveal event:", event);
  });
});
