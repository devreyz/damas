
import { Game } from "./damas/game.js";
import { Socket } from "./socket.js";

// Estado inicial do jogo
let state = [
  [null, "b", null, "b", null, "b", null, "b", null, "b"],
  ["b", null, "b", null, "b", null, "b", null, "b", null],
  [null, "b", null, "b", null, "b", null, "b", null, "b"],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  ["w", null, "w", null, "w", null, "w", null, "w", null],
  [null, "w", null, "w", null, "w", null, "w", null, "w"],
  ["w", null, "w", null, "w", null, "w", null, "w", null],
];

const game = new Game("app", state);

game.render()

const websocket = new Socket();
const io = websocket.io();
