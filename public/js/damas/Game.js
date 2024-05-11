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
 
// seu-arquivo-javascript.js
export function setup() {
  // put setup code here
  createCanvas(window.innerWidth, window.innerHeight);
  background("#4668a9");
}

let lastPos = {
  x: 0,
  y: 0,
};

export function draw() {
  // background('#000');
  fill("#ff3333");
  stroke("#000");
  circle(mouseX, mouseY, 3, 3);
  lastPos.x = mouseX;
  lastPos.y = mouseY;
}

