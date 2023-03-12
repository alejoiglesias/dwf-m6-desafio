class ErrorPage extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const errorPage = document.createElement("div");
    errorPage.classList.add("error");

    errorPage.innerHTML = `<div class="error__container">
    <h1 class="error__title">
      <span>Piedra Papel </span><span class="error__title--eton">ó</span>
      <span>Tijera</span>
    </h1>
  
    <p class="error__text">
      Ups, esta sala está completa y tu nombre no coincide con nadie en la sala.
    </p>
  </div>
  
  <div class="error__hands">
    <my-move class="error__move" type="scissors"></my-move>
    <my-move class="error__move" type="rock"></my-move>
    <my-move class="error__move" type="paper"></my-move>
  </div>`;

    const style = document.createElement("style");

    style.innerHTML = `.error {
        height: 100vh;
      
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .error__container {
        width: 100%;
        height: 100%;
      
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      
      .error__title {
        font-family: "American Typewriter Bold";
        font-weight: 700;
        font-size: 80px;
        line-height: 88.1%;
        color: var(--spanish-green);
      
        width: 288px;
        height: 219px;
      
        margin: 0px;
        margin-bottom: 63px;
      }
      
      .error__title--eton {
        color: var(--eton-blue);
      }
      
      .error__text {
        font-family: "American Typewriter";
        font-weight: 600;
        font-size: 35px;
        line-height: 100%;
        text-align: center;
      
        width: 317px;
        height: 175px;
      
        margin: 0px;
      }
      
      .error__hands {
        width: 360px;
        height: 115px;
      
        display: flex;
        justify-content: center;
        column-gap: 45px;
      
        overflow: hidden;
      }
      
      @media (min-width: 960px) {
        .error__hands {
          width: 488px;
          height: 170px;
      
          column-gap: 65px;
        }
      }
      
      .error__move {
        width: 68px;
        height: 131px;
      }
      
      @media (min-width: 960px) {
        .error__move {
          width: 97px;
          height: 185px;
        }
      }`;

    errorPage.appendChild(style);
    this.shadow.appendChild(errorPage);
  }
}

customElements.define("error-page", ErrorPage);
