import { Router } from "@vaadin/router";
import { state } from "../state";

class WaitingOpponentPage extends HTMLElement {
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
  }

  render() {
    const waitingOpponentPage = document.createElement("div");
    waitingOpponentPage.classList.add("waiting-opponent");

    waitingOpponentPage.innerHTML = `<div class="waiting-opponent__container">
    <header class="waiting-opponent__header">
      <div class="waiting-opponent__players">
        <p class="waiting-opponent__player">${this.userName}: ${
      this.score[this.userName]
    }</p>
        <p class="waiting-opponent__player--opponent">${this.opponentName}: ${
      this.score[this.opponentName]
    }</p>
      </div>
      <div class="waiting-opponent__room">
        <p class="waiting-opponent__bold">Sala</p>
        <p class="waiting-opponent__code">${this.roomId}</p>
      </div>
    </header>
  
    <div class="waiting-opponent__info">
      <h3 class="waiting-opponent__text">Compartí el código</h3>
      <h2 class="waiting-opponent__big-code">${this.roomId}</h2>
      <h3 class="waiting-opponent__text">Con tu contrincante</h3>
    </div>
  </div>
  
  <div class="waiting-opponent__hands">
    <my-move class="waiting-opponent__move" type="scissors"></my-move>
    <my-move class="waiting-opponent__move" type="rock"></my-move>
    <my-move class="waiting-opponent__move" type="paper"></my-move>
  </div>`;

    const style = document.createElement("style");

    style.innerHTML = `.waiting-opponent {
        height: 100vh;
      
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .waiting-opponent__container {
        width: 100%;
        height: 100%;
      
        display: flex;
        flex-direction: column;
      }
      
      .waiting-opponent__header {
        height: 60px;
      
        margin: 0px;
        margin-top: 24px;
      
        display: flex;
        justify-content: space-around;
      }
      
      .waiting-opponent__players {
        font-family: "American Typewriter";
        font-weight: 600;
        font-size: 24px;
        line-height: 100%;
      
        display: flex;
        flex-direction: column;
        row-gap: 5px;
      }
      
      .waiting-opponent__player,
      .waiting-opponent__player--opponent {
        width: 192.24px;
        height: 24px;
        margin: 0px;
      }
      
      .waiting-opponent__player--opponent {
        color: var(--tomato);
      }
      
      .waiting-opponent__room {
        display: flex;
        flex-direction: column;
      }
      
      .waiting-opponent__bold {
        font-family: "American Typewriter Bold";
        font-size: 24px;
        line-height: 100%;
        text-align: right;
      
        margin: 0px;
      }
      
      .waiting-opponent__code {
        font-family: "American Typewriter";
        font-weight: 400;
        font-size: 24px;
        line-height: 100%;
        text-align: right;
      
        margin: 0px;
      }
      
      .waiting-opponent__info {
        height: 100%;
      
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 30px;
      }
      
      .waiting-opponent__text {
        font-family: "American Typewriter";
        font-weight: 600;
        font-size: 35px;
        line-height: 100%;
        text-align: center;
      
        width: 351px;
        height: 35px;
      
        margin: 0px;
      }
      
      .waiting-opponent__big-code {
        font-family: "American Typewriter Bold";
        font-size: 48px;
        line-height: 100%;
        text-align: center;
      
        width: 351px;
        height: 48px;
      
        margin: 0px;
      }
      
      .waiting-opponent__hands {
        width: 360px;
        height: 115px;
      
        display: flex;
        justify-content: center;
        column-gap: 45px;
      
        overflow: hidden;
      }
      
      @media (min-width: 960px) {
        .waiting-opponent__hands {
          width: 488px;
          height: 170px;
      
          column-gap: 65px;
        }
      }
      
      .waiting-opponent__move {
        width: 68px;
        height: 131px;
      }
      
      @media (min-width: 960px) {
        .waiting-opponent__move {
          width: 97px;
          height: 185px;
        }
      }`;

    waitingOpponentPage.appendChild(style);
    this.shadow.appendChild(waitingOpponentPage);
  }
}

customElements.define("waiting-opponent-page", WaitingOpponentPage);
