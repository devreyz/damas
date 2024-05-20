import { CheckersBoardFactory } from "./Board.js";
import { PieceFactory } from "./PieceFactory.js";
import { Socket, SocketEvents } from "/js/socket.js";

const io = new Socket(username).init(socketConfig); // username e socketConfig variavel global vindo do global.js
const socketEvents = new SocketEvents(io, username);

socketEvents.connect();
socketEvents.ping();


// Example usage of the factory
const checkersPieceFactory = PieceFactory();

// Exemplo de uso do singleton do tabuleiro
const checkersBoard1 = CheckersBoardFactory.getInstance(gameState);


const checkersBoard2 = CheckersBoardFactory.getInstance();


// Movendo uma peça de (2, 1) para (3, 2)
checkersBoard1.movePiece(2, 1, 3, 2);
