class TagComponent extends HTMLElement {
  private tagStringName: string;

  constructor() {
    super();
    this.tagStringName = this.getAttribute("name") || "";
  }

  connectedCallback(): void {
    this.render();
  }

  private getTagStyles(tag: string): string {
    switch (tag.toLowerCase()) {
      case "javascript":
        return "background-color: #efd81d; color: #000;";
      case "angular":
        return "background: linear-gradient(249deg, rgba(159, 0, 38, 1) 44%, rgba(195, 0, 47, 1) 54%); color: #ffffff;";
      case "ruby on rails":
        return "background-color: #c60100; color: #ffff;";
      case "devops":
        return "background-color: #81ecec; color: darken(#81ecec, 40%);";
      // Add more cases as needed
      default:
        return "background-color: #77ffc8; color: #46a27c;";
    }
  }

  private render(): void {
    const style = this.getTagStyles(this.tagStringName);
    this.innerHTML = `
        <div class="post-tag" style="${style}">
          <a href="#">${this.tagStringName}</a>
        </div>
      `;
  }
}

export default TagComponent;
