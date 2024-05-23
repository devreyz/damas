import { showNotification } from "../components/NotifyCenter.js";
import { CheckersBoardFactory } from "./Board.js";
import { GameStateFactory } from "./GameStateFactory.js";
import { IAFactory } from "./IA.js";
import { Socket, SocketEvents } from "/js/socket.js";
import EventEmitter from "/js/utils/EventEmitter.js";

const io = new Socket(username).init(socketConfig); // username e socketConfig variavel global vindo do global.js
const socketEvents = new SocketEvents(io, username);

const btnToggleTurn = document.getElementById("toggleTurn");

EventEmitter.on("IS_NOT_YOUR_TURN", data => {
  showNotification(data);
});
EventEmitter.on("IS_NOT_YOUR_PIECE", data => {
  showNotification(data);
});
EventEmitter.on("INVALID_MOVE", data => {
  showNotification(data);
});
EventEmitter.on("IA_MESSAGE", data => {
  showNotification(data);
});


socketEvents.connect();
socketEvents.ping();
socketEvents.joinGameRoom(roomId);
socketEvents.listRooms();



// Example usage of the factory
const stateOptions = {
  turn: "black",
  playerColor: "white"
};
game.state = GameStateFactory.getInstance(gameState);
game.board = CheckersBoardFactory.getInstance(game.state);
game.state.setStateOptions(stateOptions);
game.state.findAllPossiblesPiecesMoves();
game.boardPressed = args => {
  const { mouseX, mouseY } = args;

  let col = floor(mouseX / squareSize);
  let row = floor(mouseY / squareSize);

  if (col >= 0 && col < 10 && row >= 0 && row < 10) {
    let item = game.state.getPiece(row, col);
    if (item !== null) {
      game.state.toggleSelectedPiece(item, game.state);
    } else if (game.state.selectedPiece) {
      game.state.movePiece(game.state, row, col);
    }
  }
};

btnToggleTurn.onmousedown = event => game.state.toggleTurn();


const IA = IAFactory();

const uai = IA.createIA("uai", {
  gameState: game.state,
  pieceColor: "black",
  qi: 1000
});



uai.on();
uai.processMove({turn: game.state.turn, action: "INIT"})

const yai = IA.createIA("yai", {
  gameState: game.state,
  pieceColor: "white",
  qi: 1000
});



yai.on();
yai.processMove({turn: game.state.turn, action: "INIT"})
