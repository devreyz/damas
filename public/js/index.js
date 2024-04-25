import { Socket, SocketEvents } from "/js/socket.js";
import {ToastComponent} from "/js/components/Toaster.js"
const username = document.cookie
  .split("; ")
  .find(row => row.startsWith("username="))
  .split("=")[1];

document.getElementById("user-id").textContent = username;

const socketConfig = {
  auth: {
    username: username
  }
};

const io = new Socket(username).init(socketConfig);
const socketEvents = new SocketEvents(io, username);

socketEvents.connect();
socketEvents.ping();

function addToaster() {
  const toaster = document.getElementById("toaster");
  const items = toaster.querySelectorAll("li");
  items.forEach(elem => {
    elem.classList.remove("animate-swipUp");
  });

  const li = new ToastComponent('Reyz');

  // Obter o primeiro filho existente do elemento pai
  const firstChild = toaster.firstChild;

  // Inserir o novo elemento antes do primeiro filho existente
  toaster.insertBefore(li.element, firstChild);

  //toaster.appendChild(li.element);
}
document.getElementById("btnToaster").onclick = event => addToaster();
