import { Router } from "@vaadin/router";
import { state } from "../state";

class SetNamePage extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();

    const currentState = state.getState();

    const start = currentState.start;

    if (!start) {
      return Router.go("/");
    }

    const formEl = this.shadow.querySelector(".set-name__form");

    if (currentState.rtdbRoomId) {
      formEl?.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = new FormData(e.target as HTMLFormElement);

        const value = Object.fromEntries(data.entries());

        const name = value.name;

        state.setName(name.toString());

        state
          .joinRoom()
          .then(() => {
            state.listenDatabase();
          })
          .catch(() => {
            Router.go("/error");
          });
      });
    } else {
      formEl?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = new FormData(e.target as HTMLFormElement);

        const value = Object.fromEntries(data.entries());

        const name = value.name.toString();

        state.setName(name);

        await state.createRoom();

        state.listenDatabase();

        Router.go("/room");
      });
    }
  }

  render() {
    const setNamePage = document.createElement("div");
    setNamePage.classList.add("set-name");

    setNamePage.innerHTML = `<div class="set-name__container">
    <h1 class="set-name__title">
      <span>Piedra Papel </span><span class="set-name__title--eton">ó</span>
      <span>Tijera</span>
    </h1>
  
    <form class="set-name__form">
      <label class="set-name__label">Tu Nombre</label>
      <input class="set-name__input" name="name" required />
      <button class="set-name__button"><my-button>Empezar</my-button></button>
    </form>
  </div>
  
  <div class="set-name__hands">
    <my-move class="set-name__move" type="scissors"></my-move>
    <my-move class="set-name__move" type="rock"></my-move>
    <my-move class="set-name__move" type="paper"></my-move>
  </div>`;

    const style = document.createElement("style");

    style.innerHTML = `.set-name {
      height: 100vh;
    
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .set-name__container {
      height: 100%;
    
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    .set-name__title {
      font-family: "American Typewriter Bold";
      font-weight: 700;
      font-size: 80px;
      line-height: 88.1%;
      color: var(--spanish-green);
    
      width: 288px;
      height: 219px;
    
      margin: 0px;
      margin-bottom: 18px;
    }
    
    @media (min-width: 960px) {
      .set-name__title {
        margin-bottom: 24px;
      }
    }
    
    .set-name__title--eton {
      color: var(--eton-blue);
    }
    
    .set-name__link {
      text-decoration: none;
    }
    
    .set-name__form {
      width: 322px;
    
      display: flex;
      flex-direction: column;
      row-gap: 20px;
    }
    
    @media (min-width: 960px) {
      .set-name__form {
        width: 336px;
    
        row-gap: 10px;
      }
    }
    
    .set-name__label {
      font-family: "Odibee Sans";
      font-weight: 400;
      font-size: 45px;
      line-height: 50px;
      letter-spacing: 0.05em;
      text-align: center;
    
      height: 50px;
    
      margin-bottom: -18px;
    }
    
    @media (min-width: 960px) {
      .set-name__label {
        margin: 0px;
      }
    }
    
    .set-name__input {
      box-sizing: border-box;
    
      font-family: "Odibee Sans";
      font-weight: 400;
      font-size: 45px;
      line-height: 50px;
      letter-spacing: 0.05em;
      text-align: center;
    
      padding: 7px 0px;
    
      background-color: white;
    
      border: 10px solid var(--space-cadet);
      border-radius: 10px;
    }
    
    .set-name__input::placeholder {
      color: var(--light-silver);
    }
    
    .set-name__button {
      background: transparent;
    
      padding: 0px;
    
      border: none;
    }
    
    .set-name__hands {
      width: 360px;
      height: 115px;
    
      display: flex;
      justify-content: center;
      column-gap: 45px;
    
      overflow: hidden;
    }
    
    @media (min-width: 960px) {
      .set-name__hands {
        width: 488px;
        height: 170px;
    
        column-gap: 65px;
      }
    }
    
    .set-name__move {
      width: 68px;
      height: 131px;
    }
    
    @media (min-width: 960px) {
      .set-name__move {
        width: 97px;
        height: 185px;
      }
    }`;

    setNamePage.appendChild(style);
    this.shadow.appendChild(setNamePage);
  }
}

customElements.define("set-name-page", SetNamePage);
