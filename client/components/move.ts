export function initMoveComponent() {
  class MyMove extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const type = this.getAttribute("type") as "rock" | "paper" | "scissors";

      const rockURL = require("url:../images/rock.svg");
      const paperURL = require("url:../images/paper.svg");
      const scissorsURL = require("url:../images/scissors.svg");

      this.innerHTML = `${
        type === "rock"
          ? `<img class="image" src="${rockURL}">`
          : type === "paper"
          ? `<img class="image" src="${paperURL}">`
          : `<img class="image" src="${scissorsURL}">`
      }`;

      const style = document.createElement("style");

      style.textContent = `.image {
        width: 100%;
        height: 100%;
      }`;

      this.appendChild(style);
    }
  }

  customElements.define("my-move", MyMove);
}
