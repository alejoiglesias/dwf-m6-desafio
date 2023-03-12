export function initResultComponent() {
  class MyResult extends HTMLElement {
    shadow = this.attachShadow({ mode: "open" });

    constructor() {
      super();
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const myResult = document.createElement("div");
      myResult.classList.add("result");

      const greenStarURL = require("url:../images/green-star.svg");
      const redStarURL = require("url:../images/red-star.svg");

      const result = this.getAttribute("result");

      if (result === "player") {
        myResult.innerHTML = `<img src="${greenStarURL}" />
        <h3 class="text">Ganaste</h3>`;
      } else if (result === "opponent") {
        myResult.innerHTML = `<img src="${redStarURL}" />
        <h3 class="text">Perdiste</h3>`;
      } else {
        myResult.innerHTML = `<img src="${greenStarURL}" />
        <h3 class="text">Empate</h3>`;
      }

      const style = document.createElement("style");

      style.textContent = `.result {
        position: relative;
        text-align: center;
      }
      
      .text {
        font-family: "Odibee Sans";
        font-style: normal;
        font-weight: 400;
        font-size: 55px;
        line-height: 61px;
        letter-spacing: 0.05em;
        color: #ffffff;
      
        position: absolute;
        left: 21.09%;
        right: 15.77%;
        top: 37.15%;
        bottom: 39.39%;
      
        margin: 0px;
      }`;

      this.shadow.appendChild(style);
      this.shadow.appendChild(myResult);
    }
  }

  customElements.define("my-result", MyResult);
}
