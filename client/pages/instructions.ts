import { Router } from "@vaadin/router";
import { state } from "../state";

class InstructionsPage extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });

  userName: string;
  opponentName: string;
  roomId: string;
  score: any;

  constructor() {
    super();
  }

  async connectedCallback() {
    const currentState = state.getState();

    const start = currentState.start;

    if (!start) {
      return Router.go("/");
    }

    this.roomId = currentState.roomId;
    this.userName = currentState.userName;

    state.getOpponentName();
    this.opponentName = currentState.opponentName || "Contrincante";

    await state.getHistory();

    this.score = state.getScore();

    this.render();

    const buttonEl = this.shadow.querySelector(".instructions__button");

    buttonEl?.addEventListener("click", async () => {
      await state.setPlayerStatus(true);

      if (location.pathname === "/instructions") {
        Router.go("/waiting");
      }
    });
  }

  render() {
    const instructionsPage = document.createElement("div");
    instructionsPage.classList.add("instructions");

    instructionsPage.innerHTML = `<div class="instructions__container">
    <header class="instructions__header">
      <div class="instructions__players">
        <p class="instructions__player">${this.userName}: ${
      this.score[this.userName]
    }</p>
        <p class="instructions__player--opponent">${this.opponentName}: ${
      this.score[this.opponentName]
    }</p>
      </div>
      <div class="instructions__room">
        <p class="instructions__bold">Sala</p>
        <p class="instructions__code">${this.roomId}</p>
      </div>
    </header>
  
    <div class="instructions__info">
      <h2 class="instructions__text">
        Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3
        segundos.
      </h2>
  
      <div class="instructions__button">
        <my-button>¡Jugar!</my-button>
      </div>
    </div>
  </div>
  
  <div class="instructions__hands">
    <my-move class="instructions__move" type="scissors"></my-move>
    <my-move class="instructions__move" type="rock"></my-move>
    <my-move class="instructions__move" type="paper"></my-move>
  </div>`;

    const style = document.createElement("style");

    style.innerHTML = `.instructions {
      height: 100vh;
    
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .instructions__container {
      width: 100%;
      height: 100%;
    
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .instructions__header {
      width: 100%;
      height: 60px;
    
      margin: 0px;
      margin-top: 24px;
    
      display: flex;
      justify-content: space-around;
    }
    
    .instructions__players {
      font-family: "American Typewriter";
      font-weight: 600;
      font-size: 24px;
      line-height: 100%;
    
      display: flex;
      flex-direction: column;
      row-gap: 5px;
    }
    
    .instructions__player,
    .instructions__player--opponent {
      width: 192.24px;
      height: 24px;
      margin: 0px;
    }
    
    .instructions__player--opponent {
      color: var(--tomato);
    }
    
    .instructions__room {
      display: flex;
      flex-direction: column;
    }
    
    .instructions__bold {
      font-family: "American Typewriter Bold";
      font-size: 24px;
      line-height: 100%;
      text-align: right;
    
      margin: 0px;
    }
    
    .instructions__code {
      font-family: "American Typewriter";
      font-weight: 400;
      font-size: 24px;
      line-height: 100%;
      text-align: right;
    
      margin: 0px;
    }
    
    .instructions__info {
      width: 100%;
      height: 100%;
    
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      row-gap: 40px;
    }
    
    .instructions__text {
      font-family: "American Typewriter";
      font-weight: 600;
      font-size: 35px;
      line-height: 100%;
      text-align: center;
    
      width: 317px;
      height: 175px;
    
      margin: 0px;
    }
    
    @media (min-width: 960px) {
      .instructions__info {
      }
    }
    
    .instructions__link {
      text-decoration: none;
    }
    
    .instructions__button {
      width: 322px;
      height: 87px;
    }
    
    @media (min-width: 960px) {
      .instructions__button {
        width: 404px;
      }
    }
    
    .instructions__hands {
      width: 375px;
      height: 115px;
    
      display: flex;
      justify-content: center;
      column-gap: 45px;
    
      overflow: hidden;
    }
    
    @media (min-width: 960px) {
      .instructions__hands {
        width: 488px;
        height: 170px;
    
        column-gap: 65px;
      }
    }
    
    .instructions__move {
      width: 68px;
      height: 131px;
    }
    
    @media (min-width: 960px) {
      .instructions__move {
        width: 97px;
        height: 185px;
      }
    }`;

    instructionsPage.appendChild(style);
    this.shadow.appendChild(instructionsPage);
  }
}

customElements.define("instructions-page", InstructionsPage);
