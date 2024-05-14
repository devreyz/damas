import { Socket, SocketEvents } from "/js/socket.js";
import {Board} from "/js/damas/Board.js"

const username = document.cookie
  .split("; ")
  .find(row => row.startsWith("username="))
  .split("=")[1];

const socketConfig = {
  auth: {
    username: username
  }
};

const io = new Socket(username).init(socketConfig);
const socketEvents = new SocketEvents(io, username);

console.log(state)

const board = new Board(state)


socketEvents.connect();
socketEvents.ping();


render = board.render
