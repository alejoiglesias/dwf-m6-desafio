import "./router";
import "./pages/welcome";
import "./pages/join-room";
import "./pages/set-name";
import "./pages/waiting-opponent";
import "./pages/instructions";
import "./pages/waiting-move";
import "./pages/play";
import "./pages/error";

import { initButtonComponent } from "./components/button";
import { initMoveComponent } from "./components/move";
import { initCountdownComponent } from "./components/countdown";
import { initResultComponent } from "./components/result";
import { state } from "./state";

(function main() {
  window.addEventListener("beforeunload", function (event) {
    event.preventDefault();

    state.handleUserDisconnect();
  });

  initButtonComponent();
  initMoveComponent();
  initCountdownComponent();
  initResultComponent();
})();
