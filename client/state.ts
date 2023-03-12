import { Router } from "@vaadin/router";
import { onValue, ref } from "firebase/database";
import { rtdb } from "./db";

export type Move = "rock" | "paper" | "scissors";
export type Game = {
  myPlay: Move;
  opponentPlay: Move;
};

export const state = {
  data: {
    start: false,
    userName: "",
    opponentName: "",
    roomId: "",
    rtdbRoomId: "",
    rtdbData: {},
    history: [],
  },
  listeners: [],

  getState() {
    return this.data;
  },

  setState(newState: any) {
    this.data = newState;
  },

  subscribe(callback: () => any) {
    this.listeners = [];

    this.listeners.push(callback);
  },

  setStart() {
    const currentState = this.getState();

    currentState.start = true;

    this.setState(currentState);
  },

  setName(name: string) {
    const currentState = this.getState();

    currentState.userName = name;

    this.setState(currentState);
  },

  getOpponentName() {
    const currentState = state.getState();
    const currentGame = currentState.rtdbData;

    const userName = currentState.userName;
    const opponentName = Object.keys(currentGame).find(
      (name) => name !== userName
    );

    currentState.opponentName = opponentName;

    this.setState(currentState);
  },

  setRoomId(roomId: string) {
    const currentState = this.getState();

    currentState.roomId = roomId;

    this.setState(currentState);
  },

  async createRoom() {
    const currentState = this.getState();

    const userName = currentState.userName;

    const url = `${process.env.API_BASE_URL}/room`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ userName }),
    });

    const data = await response.json();

    currentState.roomId = data.roomId;
    currentState.rtdbRoomId = data.rtdbRoomId;

    this.setState(currentState);
  },

  async getRtdbRoomId() {
    const currentState = this.getState();

    const roomId = currentState.roomId;

    const url = `${process.env.API_BASE_URL}/room/${roomId}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "get",
    });

    if (!response.ok) {
      throw new Error();
    }

    const data = await response.json();

    currentState.rtdbRoomId = data.rtdbRoomId;

    this.setState(currentState);
  },

  async joinRoom() {
    const currentState = this.getState();

    const rtdbRoomId = currentState.rtdbRoomId;
    const userName = currentState.userName;

    const url = `${process.env.API_BASE_URL}/rtdb/room/${rtdbRoomId}/?userName=${userName}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        choice: "",
        online: true,
        start: false,
      }),
    });

    if (!response.ok) {
      throw new Error();
    }

    await response.json();
  },

  listenDatabase() {
    const currentState = this.getState();

    const rtdbRoomId = currentState.rtdbRoomId;

    const rtdbRef = ref(rtdb, "/rps/rooms/" + rtdbRoomId);

    onValue(rtdbRef, (snapshot) => {
      const currentState = this.getState();

      const value = snapshot.val();

      currentState.rtdbData = value.currentGame;

      this.setState(currentState);

      this.checkPlayersStatus();
    });
  },

  checkPlayersStatus() {
    const currentState = this.getState();
    const currentGame = currentState.rtdbData;

    const players = Object.values(currentGame) as any;

    const isAllPlayersOnline = players.every((player: any) => player.online);
    const isAllPlayersReady = players.every((player: any) => player.start);
    const isOnePlayerReady = players.some((player: any) => player.start);
    const isAllPlayersMove = players.every((player: any) => player.choice);
    const isOnePlayerMove = players.some((player: any) => player.choice);

    if (players.length === 2) {
      if (isAllPlayersMove) {
        for (const cb of this.listeners) {
          cb();
        }
      } else if (!isAllPlayersOnline) {
        Router.go("/room");

        this.setPlayerStatus(false);
      } else if (isOnePlayerMove && !isOnePlayerReady) {
        Router.go("/instructions");
      } else if (isAllPlayersReady) {
        Router.go("/play");
      } else if (isAllPlayersOnline && !isOnePlayerReady) {
        Router.go("/instructions");
      }
    }

    if (players.length === 1) {
      Router.go("/room");
    }
  },

  async setPlayerStatus(start: boolean) {
    const currentState = this.getState();

    const rtdbRoomId = currentState.rtdbRoomId;
    const userName = currentState.userName;

    const url = `${process.env.API_BASE_URL}/rtdb/room/${rtdbRoomId}/?userName=${userName}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        choice: "",
        online: true,
        start: start,
      }),
    });

    await response.json();
  },

  async setMove(myPlay: Move) {
    const currentState = this.getState();

    const userName = currentState.userName;
    const rtdbRoomId = currentState.rtdbRoomId;

    const url = `${process.env.API_BASE_URL}/rtdb/room/${rtdbRoomId}/?userName=${userName}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        choice: myPlay,
        online: true,
        start: false,
      }),
    });

    await response.json();
  },

  opponentMove() {
    const currentState = state.getState();
    const currentGame = currentState.rtdbData;

    const opponentName = currentState.opponentName;

    const opponentPlay = currentGame[opponentName].choice;

    return opponentPlay;
  },

  whoWins(myPlay: Move, opponentMove: Move) {
    function winner(p1: string, p2: string): boolean {
      return (
        (p1 === "scissors" && p2 === "paper") ||
        (p1 === "rock" && p2 === "scissors") ||
        (p1 === "paper" && p2 === "rock")
      );
    }

    if (winner(myPlay, opponentMove)) {
      return "player";
    } else if (winner(opponentMove, myPlay)) {
      return "opponent";
    } else {
      return "draw";
    }
  },

  getScore() {
    const currentState = state.getState();

    const userName = currentState.userName;
    const opponentName = currentState.opponentName || "Contrincante";

    const score = {
      [userName]: 0,
      [opponentName]: 0,
    };

    if (currentState.history.length === 0) {
      return score;
    }

    currentState.history.forEach((game: Game) => {
      const result = state.whoWins(game[userName], game[opponentName]);

      if (result === "player") {
        score[userName]++;
      } else if (result === "opponent") {
        score[opponentName]++;
      }
    });

    return score;
  },

  async getHistory() {
    const currentState = this.getState();

    const roomId = currentState.roomId;

    const url = `${process.env.API_BASE_URL}/room/${roomId}/history`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "get",
    });

    if (!response.ok) {
      throw new Error();
    }

    const data = await response.json();

    currentState.history = data.history;

    this.setState(currentState);
  },

  pushToHistory(myPlay: Move, opponentPlay: Move) {
    const currentState = this.getState();

    const userName = currentState.userName;
    const opponentName = currentState.opponentName;

    const game = {
      [userName]: myPlay,
      [opponentName]: opponentPlay,
    };

    currentState.history.push(game);

    this.setState(currentState);
  },

  async setHistory() {
    const currentState = this.getState();

    const roomId = currentState.roomId;
    const history = currentState.history;

    const url = `${process.env.API_BASE_URL}/room/${roomId}/history`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ history }),
    });

    await response.json();
  },

  async handleUserDisconnect() {
    const currentState = this.getState();

    const rtdbRoomId = currentState.rtdbRoomId;
    const userName = currentState.userName;

    const url = `${process.env.API_BASE_URL}/rtdb/room/${rtdbRoomId}/?userName=${userName}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        choice: "",
        online: false,
        start: false,
      }),
    });

    await response.json();
  },
};
