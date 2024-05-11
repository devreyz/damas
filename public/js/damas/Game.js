import { Socket, SocketEvents } from "/js/socket.js";

const username = document.cookie
  .split("; ")
  .find((row) => row.startsWith("username="))
  .split("=")[1];

const socketConfig = {
  auth: {
    username: username,
  },
};

const io = new Socket(username).init(socketConfig);
const socketEvents = new SocketEvents(io, username);

socketEvents.connect();
socketEvents.ping();

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}