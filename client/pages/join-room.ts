import { Router } from "@vaadin/router";
import { state } from "../state";

class JoinRoomPage extends HTMLElement {
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

    const formEl = this.shadow.querySelector(".join-room__form");

    formEl?.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(e.target as HTMLFormElement);

      const value = Object.fromEntries(data.entries());

      const roomId = value.roomId.toString();

      state.setRoomId(roomId);

      state
        .getRtdbRoomId()
        .then(() => {
          Router.go("/name");
        })
        .catch(() => {
          Router.go("/error");
        });
    });
  }

  render() {
    const joinRoomPage = document.createElement("div");
    joinRoomPage.classList.add("join-room");

    joinRoomPage.innerHTML = `<div class="join-room__container">
    <h1 class="join-room__title">
      <span>Piedra Papel </span><span class="join-room__title--eton">ó</span>
      <span>Tijera</span>
    </h1>
  
    <form class="join-room__form">
      <input class="join-room__input" name="roomId" required />
      <button class="join-room__button">
        <my-button>Ingresar a la sala</my-button>
      </button>
    </form>
  </div>
  
  <div class="join-room__hands">
    <my-move class="join-room__move" type="scissors"></my-move>
    <my-move class="join-room__move" type="rock"></my-move>
    <my-move class="join-room__move" type="paper"></my-move>
  </div>`;

    const style = document.createElement("style");

    style.innerHTML = `.join-room {
      height: 100vh;
    
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .join-room__container {
      height: 100%;
    
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    .join-room__title {
      font-family: "American Typewriter Bold";
      font-weight: 700;
      font-size: 80px;
      line-height: 88.1%;
      color: var(--spanish-green);
    
      width: 288px;
      height: 219px;
    
      margin: 0px;
      margin-bottom: 44px;
    }
    
    @media (min-width: 960px) {
      .join-room__title {
        margin-bottom: 58px;
      }
    }
    
    .join-room__title--eton {
      color: var(--eton-blue);
    }
    
    .join-room__link {
      text-decoration: none;
    }
    
    .join-room__form {
      width: 322px;
    
      display: flex;
      flex-direction: column;
      row-gap: 20px;
    }
    
    @media (min-width: 960px) {
      .join-room__form {
        width: 336px;
      }
    }
    
    .join-room__input {
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
    
    .join-room__input::placeholder {
      color: var(--light-silver);
    }
    
    .join-room__button {
      background: transparent;
    
      padding: 0px;
    
      border: none;
    }
    
    .join-room__hands {
      width: 360px;
      height: 115px;
    
      display: flex;
      justify-content: center;
      column-gap: 45px;
    
      overflow: hidden;
    }
    
    @media (min-width: 960px) {
      .join-room__hands {
        width: 488px;
        height: 170px;
    
        column-gap: 65px;
      }
    }
    
    .join-room__move {
      width: 68px;
      height: 131px;
    }
    
    @media (min-width: 960px) {
      .join-room__move {
        width: 97px;
        height: 185px;
      }
    }`;

    joinRoomPage.appendChild(style);
    this.shadow.appendChild(joinRoomPage);
  }
}

customElements.define("join-room-page", JoinRoomPage);
