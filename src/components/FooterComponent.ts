class FooterComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
  }

  private render(): void {
    this.innerHTML = `
        <footer class="footer">
          <div class="footer__container">
            <section>
              <p>
                Jeg heter Michael Krøyserth-Simsø. Jeg en frontendutvikler med. Kan
                håndere baksiden godt ved behov. Holder til i Tromsø. Liker alt
                Javscript. Har en forkjærlighet for design og interaksjonsdesign.
                Synes i all hemmelighet at DevOps er spennende.
              </p>
            </section>
            <section class="footer__secondary">
              <div>
                <a href="https://github.com/michaelsimsoe" class="github-link">
                  <img src="/static/github.svg" alt="github" />
                </a>
                <a href="https://www.linkedin.com/in/michaelsimsoe">
                  <img src="/static/linkedin.svg" alt="linkedin" />
                </a>
              </div>
              <div></div>
            </section>
          </div>
        </footer>
      `;
  }
}

export default FooterComponent;
