import { CheckersBoardFactory } from "./Board.js";
import { GameStateFactory } from "./GameStateFactory.js";
import { Socket, SocketEvents } from "/js/socket.js";
import EventEmitter from "/js/utils/EventEmitter.js";

const io = new Socket(username).init(socketConfig); // username e socketConfig variavel global vindo do global.js
const socketEvents = new SocketEvents(io, username);

socketEvents.connect();
socketEvents.ping();

// Example usage of the factory
game.state = GameStateFactory.getInstance(gameState);
game.board = CheckersBoardFactory.getInstance(game.state);


game.boardPressed = args => {
  const { mouseX, mouseY } = args;
  
  //const mouseX = args.mouseX
  // const mouseY = args.mouseY
  let col = floor(mouseX / squareSize);
  let row = floor(mouseY / squareSize);

  if (col >= 0 && col < 10 && row >= 0 && row < 10) {
    
    let piece = game.state.getPiece(row, col);
    
    if (piece !== null) {
      piece.toggleSelect()
      console.log({
        ACTION: "TILE_CLICKED",
        pos: {
          row: row,
          col: col
        },
        piece: piece
      });
      // Adicione aqui a lógica para selecionar ou mover a peça
    }
  }
};
