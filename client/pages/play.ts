import { Router } from "@vaadin/router";
import { Move, state } from "../state";

class PlayPage extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });

  constructor() {
    super();
  }

  connectedCallback() {
    const currentState = state.getState();

    const start = currentState.start;

    if (!start) {
      return Router.go("/");
    }

    this.render();
  }

  render() {
    const playPage = document.createElement("div");
    playPage.classList.add("play");

    playPage.innerHTML = `<div class="play__container">
    <my-countdown></my-countdown>
  </div>
  
  <div class="play__hands">
    <my-move class="play__move" type="scissors"></my-move>
    <my-move class="play__move" type="rock"></my-move>
    <my-move class="play__move" type="paper"></my-move>
  </div>`;

    const style = document.createElement("style");

    style.innerHTML = `.play {
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.play__container {
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.play__hands {
  width: 375px;
  height: 360px;

  display: flex;
  justify-content: center;
  align-items: end;
  column-gap: 11px;

  overflow: hidden;
}

@media (min-width: 960px) {
  .play__hands {
    width: 100%;

    column-gap: 45px;
  }
}

.play__move {
  position: relative;
  top: 55px;

  width: 124px;
  height: 240px;
}

.play__move--blurred {
  top: 95px;

  opacity: 0.5;
}

.play__move--select {
  top: 15px;

  opacity: unset;
}

.play__result {
  width: 375px;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  overflow: hidden;
}

.play__position {
  position: relative;

  width: 171px;
}

.play__player {
  top: 15px;
}

.play__computer {
  bottom: 15px;

  transform: rotate(180deg);
}

.result {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;

  min-width: 375px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.result--win {
  background-color: var(--dark-tan);
}

.result--lose {
  background-color: var(--cordovan);
}

.result__image {
  margin-bottom: 11px;
}

.result__box {
  background-color: #ffffff;

  width: 259px;
  height: 217px;

  margin-bottom: 21px;

  border: 10px solid #000000;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  row-gap: 13px;
}

.result__score {
  font-family: "Odibee Sans";
  font-weight: 400;
  font-size: 55px;
  line-height: 61px;
  letter-spacing: 0.05em;

  margin: 0px;
  margin-top: 5px;

  align-self: center;
}

.result__text {
  font-family: "Odibee Sans";
  font-weight: 400;
  font-size: 45px;
  line-height: 50px;
  letter-spacing: 0.05em;

  margin: 0px;
  margin-right: 30px;

  align-self: flex-end;
}

.result__link {
  text-decoration: none;
}

.result__button {
  width: 335px;
  height: 87px;
}`;

    this.shadow.appendChild(style);
    this.shadow.appendChild(playPage);

    initCountdown(playPage);
  }
}

customElements.define("play-page", PlayPage);

function initCountdown(container: Element) {
  myMove(container);

  let count = 3;

  const countdown = setInterval(async () => {
    count--;

    if (count === 0) {
      clearInterval(countdown);

      const checkMove = container.querySelector(".play__move--select");

      if (checkMove) {
        const myPlay = checkMove.getAttribute("type") as Move;

        await state.setMove(myPlay);

        state.subscribe(async () => {
          const opponentPlay = state.opponentMove() as Move;

          container.innerHTML = `<div class="play__result">
          <my-move
            class="play__position play__computer"
            type="${opponentPlay}"
          ></my-move>
          <my-move class="play__position play__player" type="${myPlay}"></my-move>
        </div>`;

          const winner = state.whoWins(myPlay, opponentPlay);

          state.pushToHistory(myPlay, opponentPlay);

          await state.setHistory();

          initResult(winner);
        });
      } else {
        await state.setPlayerStatus(false);
      }
    }
  }, 1000);

  function myMove(container: Element) {
    const moves = ["rock", "paper", "scissors"];

    moves.forEach((move) => {
      const hand = container.querySelector(`[type=${move}]`);

      hand?.addEventListener("click", () => {
        lowerOpacity(container);

        hand.classList.add("play__move--select");
      });
    });
  }

  function lowerOpacity(container: Element) {
    const hands = container.querySelectorAll(".play__move");

    hands.forEach((hand) => {
      hand.classList.remove("play__move--select");
      hand.classList.add("play__move--blurred");
    });
  }

  async function initResult(result: string) {
    const currentState = state.getState();

    const userName = currentState.userName;
    const opponentName = currentState.opponentName;

    const resultPage = document.createElement("div");
    resultPage.classList.add("result");

    if (result === "opponent") {
      resultPage.classList.add("result--lose");
    } else {
      resultPage.classList.add("result--win");
    }

    await state.getHistory();

    const score = state.getScore();

    resultPage.innerHTML = `<div class="result__image">
      <my-result result="${result}"></my-result>
    </div>

    <div class="result__box">
      <h4 class="result__score">Score</h4>
      <h5 class="result__text">Vos: ${score[userName]}</h5>
      <h5 class="result__text">${opponentName}: ${score[opponentName]}</h5>
    </div>

    <div class="result__button">
      <my-button>Volver a Jugar</my-button>
    </div>`;

    const button = resultPage.querySelector(".result__button");
    button?.addEventListener("click", () => {
      Router.go("/instructions");
    });

    container.appendChild(resultPage);
  }
}
