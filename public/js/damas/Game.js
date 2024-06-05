import { showNotification } from "../components/NotifyCenter.js";
import { CheckersBoardFactory } from "./Board.js";
import { GameStateFactory } from "./GameStateFactory.js";
import { IAFactory } from "./IA.js";
import { Socket, SocketEvents } from "/js/socket.js";
import EventEmitter from "/js/utils/EventEmitter.js";

const io = new Socket(username).init(socketConfig); // username e socketConfig variavel global vindo do global.js
const socketEvents = new SocketEvents(io, username);

const btnToggleTurn = document.getElementById("toggleTurn");
const quitButton = document.getElementById("quitButton");

socketEvents.connect();
socketEvents.ping();
socketEvents.joinGameRoom(roomId);
socketEvents.listRooms();

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


EventEmitter.on("TOGGLE_TURN", turn => {
  
});

EventEmitter.on("IO_SELECT_PIECE", data => {
  const piece = game.state.getPiece(data.position.row, data.position.column);
  piece.piece.isSelected = true;
  game.state.setSelectedPiece(piece, true);
});

EventEmitter.on("ON_ROOM", data => {
  // Example usage of the factory
  const stateOptions = {
    turn: data.turn,
    playerColor: data[username].color
  };
  game.state = GameStateFactory.getInstance(gameState);
  game.board = CheckersBoardFactory.getInstance(game.state);
  game.state.setStateOptions(stateOptions);
  game.state.findAllPossiblesPiecesMoves();
  game.boardPressed = (data, io) => {
    const { col, row } = data.position;
    console.log(data)

    if (col >= 0 && col < 10 && row >= 0 && row < 10) {
      let item = game.state.getPiece(row, col);

      if (!io && game.state.turn === game.state.playerColor ) {
        
        //alert()
        EventEmitter.emit(
          "BOARD_ON_PRESSED",
          data,
          res => {
            console.log(res);
          }
        );
      }
      if (item !== null) {
        game.state.toggleSelectedPiece(item, game.state, data);
      } else if (game.state.selectedPiece) {
        game.state.movePiece(game.state, row, col);
      }
    }
  };

  EventEmitter.on("IO_BOARD_ON_PRESSED", data => {
    //alert('recebi');
    
   console.log("position: ", data);
    game.boardPressed(data, true);
  });

  document.getElementById("turnView").classList =
    game.state.turn === "black"
      ? "bg-orange-400 animate-bounce rounded-full w-6 h-6"
      : "bg-white animate-bounce rounded-full w-6 h-6";

  btnToggleTurn.onmousedown = event => game.state.toggleTurn();
  quitButton.onclick = ev => {
    EventEmitter.emit("QUIT_GAME_ROOM", {room: roomId});
  };

  const IA = IAFactory();

  const uai = IA.createIA("uai", {
    gameState: game.state,
    pieceColor: "white",
    qi: 100
  });

  //uai.on();
 // uai.processMove({turn: game.state.turn, action: "INIT"})

  const iai = IA.createIA("iai", {
    gameState: game.state,
    pieceColor: "black",
    qi: 100
  });
  
  


 // iai.on();
 // iai.processMove({turn: game.state.turn, action: "INIT"})
});
