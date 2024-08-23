class MainHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setCurrentNavLink();
    this.querySelector(".header-menu-btn")?.addEventListener(
      "click",
      this.toggleNavbar.bind(this)
    );
  }

  render() {
    this.innerHTML = `
        <header class="main-header">
          <div class="header-link-container">
            <a href="/" class="header-link">
              <div class="header-main-text">michael <span>krøyserth-simsø<span></div>
              <div class="header-sub-text">
                fullstack med en dæsj av <span>design</span>
              </div>
            </a>
          </div>
          <div
            class="header-menu-btn"
            id="menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <nav class="header-nav">
            <a class="header-nav__link" href="/">Hjem</a>
            <a class="header-nav__link" href="/meg/">Meg</a>
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

  toggleNavbar() {
    const headerNav = this.querySelector(".header-nav");
    const menuBtn = this.querySelector(".header-menu-btn");

    headerNav?.classList.toggle("header-nav--open");
    menuBtn?.classList.toggle("header-menu-btn--open");

    // Toggle scrolling on the body
    if (headerNav?.classList.contains("header-nav--open")) {
      // If the navbar is open, disable scrolling
      document.body.style.overflow = "hidden";
    } else {
      // If the navbar is closed, enable scrolling
      document.body.style.overflow = "";
    }
  }
}

export default MainHeader;
