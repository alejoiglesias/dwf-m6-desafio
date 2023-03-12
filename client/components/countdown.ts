export function initCountdownComponent() {
  class MyCountdown extends HTMLElement {
    shadow = this.attachShadow({ mode: "open" });

    constructor() {
      super();
    }

    connectedCallback() {
      this.render();
    }

    render() {
      let count = 3;

      const myCountdown = document.createElement("p");
      myCountdown.classList.add("countdown");

      myCountdown.textContent = count.toString();

      const countdown = setInterval(() => {
        count--;

        myCountdown.textContent = count.toString();

        if (count === 0) {
          clearInterval(countdown);
        }
      }, 1000);

      const style = document.createElement("style");

      style.innerHTML = `.countdown {
        font-family: "American Typewriter Bold";
        font-weight: 700;
        font-size: 100px;
        line-height: 100%;
        text-align: center;
        color: black;
      }`;

      this.shadow.appendChild(style);
      this.shadow.appendChild(myCountdown);
    }
  }

  customElements.define("my-countdown", MyCountdown);
}
