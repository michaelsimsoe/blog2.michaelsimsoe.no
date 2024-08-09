class ArticlePreview extends HTMLElement {
  private _data: {
    title: string;
    date: string;
    updated: string;
    description: string;
    tags: string[];
    heroimage: string;
    readingDuration: number;
    slug: string;
  } | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  set data(article: {
    title: string;
    date: string;
    updated: string;
    description: string;
    tags: string[];
    heroimage: string;
    readingDuration: number;
    slug: string;
  }) {
    this._data = article;
    this.render();
  }

  render() {
    if (!this._data) return;

    const { title, date, updated, description, tags, readingDuration, slug } =
      this._data;

    this.innerHTML = `
        <article>
          <header class="article-preview">
            <a class="article-preview__link" href="${slug}">
              <h3 class="article-preview__link-heading">${title}</h3>
            </a>
            <div class="article-preview__tags">
              ${tags
                .map(
                  (tag) =>
                    `<div class="article-preview__tag"><a href="#">${tag}</a></div>`
                )
                .join("")}
            </div>
            <div class="article-preview__meta">
              <time datetime="${new Date(date).toISOString()}">
                ${new Date(
                  date
                ).toLocaleDateString()} <em>(oppdatert ${new Date(
      updated
    ).toLocaleDateString()})</em>
              </time>
              <div>ca. ${readingDuration} minutter med lesestoff</div>
            </div>
          </header>
          <section class="article-preview__intro">
            <p>
              ${description}
              <a class="styles-module--article__read_more--181d7" href="${slug}">
                <strong>[ ... ]</strong>
              </a>
            </p>
          </section>
        </article>
      `;
  }
}

export default ArticlePreview;
