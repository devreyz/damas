import { showNotification } from "../components/NotifyCenter.js";
import { CheckersBoardFactory } from "./Board.js";
import { GameStateFactory } from "./GameStateFactory.js";
import { Socket, SocketEvents } from "/js/socket.js";
import EventEmitter from "/js/utils/EventEmitter.js";

const io = new Socket(username).init(socketConfig); // username e socketConfig variavel global vindo do global.js
const socketEvents = new SocketEvents(io, username);

const btnToggleTurn = document.getElementById("toggleTurn");






socketEvents.connect();
socketEvents.ping();
socketEvents.joinGameRoom(roomId)
socketEvents.listRooms()

// Example usage of the factory
const stateOptions = {
  turn: "black",
  playerColor: "black",
};
game.state = GameStateFactory.getInstance(gameState);
game.board = CheckersBoardFactory.getInstance(game.state);
game.state.setStateOptions(stateOptions);
game.state.findAllPossiblesPiecesMoves();
game.boardPressed = (args) => {
  const { mouseX, mouseY } = args;

  //const mouseX = args.mouseX
  // const mouseY = args.mouseY
  let col = floor(mouseX / squareSize);
  let row = floor(mouseY / squareSize);

  if (col >= 0 && col < 10 && row >= 0 && row < 10) {
    let item = game.state.getPiece(row, col);

    if (item !== null) {
      //console.log(item);
      game.state.toggleSelectedPiece(item, game.state);
      //console.log("Movimentos possiveis");
    } else if (game.state.selectedPiece) {
      
        //console.log(game.state.selectedPiece.getPosition())
        game.state.movePiece(game.state, row, col);
        //console.log(game.state.selectedPiece?.getInfo("possibleMovements"));
      
    }
  }
};

btnToggleTurn.onmousedown = (event) => game.state.toggleTurn();
EventEmitter.on("IS_NOT_YOUR_TURN", (data) => {
  showNotification(data.msg);
});
EventEmitter.on("IS_NOT_YOUR_PIECE", (data) => {
  showNotification(data.msg);
  socketEvents.enchangeMovedata(roomId, "Vai que da")
});
EventEmitter.on("INVALID_MOVE", (data) => {
  showNotification(data.msg);
});
