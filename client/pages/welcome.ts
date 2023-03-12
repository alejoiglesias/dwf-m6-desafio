import { Router } from "@vaadin/router";
import { state } from "../state";

class WelcomePage extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const welcomePage = document.createElement("div");
    welcomePage.classList.add("welcome");

    welcomePage.innerHTML = `<div class="welcome__container">
  <h1 class="welcome__title">
    <span>Piedra Papel </span><span class="welcome__title--eton">ó</span>
    <span>Tijera</span>
  </h1>

  <div class="welcome__button">
    <my-button id="new">Nuevo Juego</my-button>
    <my-button id="join">Ingresar a una sala</my-button>
  </div>
</div>

<div class="welcome__hands">
  <my-move class="welcome__move" type="scissors"></my-move>
  <my-move class="welcome__move" type="rock"></my-move>
  <my-move class="welcome__move" type="paper"></my-move>
</div>`;

    const style = document.createElement("style");

    style.innerHTML = `.welcome {
    height: 100vh;
  
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .welcome__container {
    height: 100%;
  
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .welcome__title {
    font-family: "American Typewriter Bold";
    font-weight: 700;
    font-size: 80px;
    line-height: 88.1%;
    color: var(--spanish-green);
  
    width: 288px;
    height: 219px;
  
    margin: 0px;
    margin-bottom: 40px;
  }
  
  .welcome__title--eton {
    color: var(--eton-blue);
  }
  
  .welcome__link {
    text-decoration: none;
  }
  
  .welcome__button {
    width: 322px;
  
    display: flex;
    flex-direction: column;
    row-gap: 20px;
  }
  
  @media (min-width: 960px) {
    .welcome__button {
      width: 336px;

      row-gap: 40px;
    }
  }
  
  .welcome__hands {
    width: 360px;
    height: 115px;
  
    display: flex;
    justify-content: center;
    column-gap: 45px;
  
    overflow: hidden;
  }
  
  @media (min-width: 960px) {
    .welcome__hands {
      width: 488px;
      height: 170px;
  
      column-gap: 65px;
    }
  }
  
  .welcome__move {
    width: 68px;
    height: 131px;
  }
  
  @media (min-width: 960px) {
    .welcome__move {
      width: 97px;
      height: 185px;
    }
  }`;

    welcomePage.appendChild(style);
    this.shadow.appendChild(welcomePage);

    const newGameButtonEl = welcomePage.querySelector("#new");
    newGameButtonEl?.addEventListener("click", () => {
      state.setStart();

      Router.go("/name");
    });

    const joinGameButtonEl = welcomePage.querySelector("#join");
    joinGameButtonEl?.addEventListener("click", () => {
      state.setStart();

      Router.go("/join");
    });
  }
}

customElements.define("welcome-page", WelcomePage);
