import { CheckersBoardFactory } from "./Board.js";
import { PieceFactory } from "./PieceFactory.js";
import { GameStateFactory } from "./GameStateFactory.js";
import { Socket, SocketEvents } from "/js/socket.js";

const io = new Socket(username).init(socketConfig); // username e socketConfig variavel global vindo do global.js
const socketEvents = new SocketEvents(io, username);

socketEvents.connect();
socketEvents.ping();



// Example usage of the factory
game.state = GameStateFactory.getInstance(gameState);
game.board = CheckersBoardFactory.getInstance(game.state);
