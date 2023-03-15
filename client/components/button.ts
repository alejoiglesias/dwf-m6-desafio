export function initButtonComponent() {
  class MyButton extends HTMLElement {
    shadow = this.attachShadow({ mode: "open" });

    constructor() {
      super();
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const myButton = document.createElement("button");
      myButton.classList.add("button");

      myButton.textContent = this.textContent;

      const style = document.createElement("style");

      style.textContent = `.button {
        font-family: "Odibee Sans";
        font-weight: 400;
        font-size: 45px;
        line-height: 50px;
        letter-spacing: 0.05em;
        text-align: center;
        color: var(--light-cyan);
      
        width: 100%;
        height: 100%;

        padding: 9px 0px;

        background-color: var(--brandeis-blue);
      
        border: 10px solid var(--imperial-blue);
        border-radius: 10px;

        display: block;
        
        cursor: pointer;
      }`;

      this.shadow.appendChild(style);
      this.shadow.appendChild(myButton);
    }
  }

  customElements.define("my-button", MyButton);
}
