import { Router } from "@vaadin/router";
import { state } from "../state";

class WaitingMovePage extends HTMLElement {
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
    this.opponentName = currentState.opponentName || "Contrincante";

    await state.getHistory();

    this.score = state.getScore();

    this.render();
  }

  render() {
    const waitingMovePage = document.createElement("div");
    waitingMovePage.classList.add("waiting-move");

    waitingMovePage.innerHTML = `<div class="waiting-move__container">
    <header class="waiting-move__header">
      <div class="waiting-move__players">
        <p class="waiting-move__player">${this.userName}: ${
      this.score[this.userName]
    }</p>
        <p class="waiting-move__player--opponent">${this.opponentName}: ${
      this.score[this.opponentName]
    }</p>
      </div>
      <div class="waiting-move__room">
        <p class="waiting-move__bold">Sala</p>
        <p class="waiting-move__code">76HH23</p>
      </div>
    </header>
  
    <div class="waiting-move__info">
      <h3 class="waiting-move__text">
        Esperando a que
        <span class="waiting-move__text--bold">${
          this.opponentName
        }</span> presione ¡Jugar!...
      </h3>
    </div>
  </div>
  
  <div class="waiting-move__hands">
    <my-move class="waiting-move__move" type="scissors"></my-move>
    <my-move class="waiting-move__move" type="rock"></my-move>
    <my-move class="waiting-move__move" type="paper"></my-move>
  </div>`;

    const style = document.createElement("style");

    style.innerHTML = `.waiting-move {
        height: 100vh;
      
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .waiting-move__container {
        width: 100%;
        height: 100%;
      
        display: flex;
        flex-direction: column;
      }
      
      .waiting-move__header {
        height: 60px;
      
        margin: 0px;
        margin-top: 24px;
      
        display: flex;
        justify-content: space-around;
      }
      
      .waiting-move__players {
        font-family: "American Typewriter";
        font-weight: 600;
        font-size: 24px;
        line-height: 100%;
      
        display: flex;
        flex-direction: column;
        row-gap: 5px;
      }
      
      .waiting-move__player,
      .waiting-move__player--opponent {
        width: 192.24px;
        height: 24px;
        margin: 0px;
      }
      
      .waiting-move__player--opponent {
        color: var(--tomato);
      }
      
      .waiting-move__room {
        display: flex;
        flex-direction: column;
      }
      
      .waiting-move__bold {
        font-family: "American Typewriter Bold";
        font-size: 24px;
        line-height: 100%;
        text-align: right;
      
        margin: 0px;
      }
      
      .waiting-move__code {
        font-family: "American Typewriter";
        font-weight: 400;
        font-size: 24px;
        line-height: 100%;
        text-align: right;
      
        margin: 0px;
      }
      
      .waiting-move__info {
        height: 100%;
      
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 30px;
      }
      
      .waiting-move__text, .waiting-move__text--bold {
        font-family: "American Typewriter";
        font-weight: 600;
        font-size: 35px;
        line-height: 100%;
        text-align: center;
      
        width: 317px;
        height: 105px;
      
        margin: 0px;
      }

      .waiting-move__text--bold {
        font-family: "American Typewriter Bold";
      }
      
      .waiting-move__hands {
        width: 360px;
        height: 115px;
      
        display: flex;
        justify-content: center;
        column-gap: 45px;
      
        overflow: hidden;
      }
      
      @media (min-width: 960px) {
        .waiting-move__hands {
          width: 488px;
          height: 170px;
      
          column-gap: 65px;
        }
      }
      
      .waiting-move__move {
        width: 68px;
        height: 131px;
      }
      
      @media (min-width: 960px) {
        .waiting-move__move {
          width: 97px;
          height: 185px;
        }
      }`;

    waitingMovePage.appendChild(style);
    this.shadow.appendChild(waitingMovePage);
  }
}

customElements.define("waiting-move-page", WaitingMovePage);
