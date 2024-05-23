import { Socket, SocketEvents } from "/js/socket.js";

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
const refreshPlayersBtn = document.getElementById("refreshPlayersBtn");
const userId = document.getElementById("user-id");
const btnListRooms = document.getElementById("btnListRooms");

socketEvents.connect();
socketEvents.ping();
socketEvents.listUsers();
refreshPlayersBtn.onclick = () => socketEvents.listUsers();
setInterval(() => socketEvents.listUsers(), 10000);
userId.textContent = username;

btnListRooms.onclick = () => listarSalas();

function listarSalas() {
  socketEvents.listRooms();
}
socketEvents.joinGameRoom();
// Função para exibir um alerta quando a página volta ao foco
function handlePageFocus() {
  //console.log("A página está de volta ao foco!");
}

// Adiciona um ouvinte de evento para quando a página volta ao foco
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // Verifica se a página não está oculta
    handlePageFocus();
  }
});
