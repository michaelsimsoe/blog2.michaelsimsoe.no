class MainHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setCurrentNavLink();
  }

  render() {
    this.innerHTML = `
        <header class="main-header">
          <div class="header-link-container">
            <a href="/" class="header-link">
              <div class="header-main-text">michael krøyserth-simsø</div>
              <div class="header-sub-text">
                fullstack med en dæsj av <span>design</span>
              </div>
            </a>
          </div>
          <nav class="header-nav">
            <a class="header-nav__link" href="/">Hjem</a>
            <a class="header-nav__link" href="/meg/">Om meg</a>
          </nav>
        </header>
      `;
  }

  setCurrentNavLink() {
    const currentPath = window.location.pathname;

    const navLinks = this.querySelectorAll(".header-nav__link");
    // console.log(currentPath)
    navLinks.forEach((link) => {
      // console.log(link.getAttribute("href"))
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("header-nav__link--current");
      } else {
        link.classList.remove("header-nav__link--current");
      }
    });
  }
}

export default MainHeader;
