import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "welcome-page" },
  { path: "/join", component: "join-room-page" },
  { path: "/name", component: "set-name-page" },
  { path: "/room", component: "waiting-opponent-page" },
  { path: "/error", component: "error-page" },
  { path: "/instructions", component: "instructions-page" },
  { path: "/waiting", component: "waiting-move-page" },
  { path: "/play", component: "play-page" },
  { path: "(.*)", component: "welcome-page" },
]);
