import { Socket } from "./socket.js"



const socket = new Socket().socket;
document.addEventListener("submit", e => sendMessage(e));

function sendMessage(e) {
  e.preventDefault();
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value.trim();
  if (message !== "") {
    socket.emit(
      "message",
      JSON.stringify({
        sender: socket.id,
        recipient: socket.id,
        content: message
      })
    );
    messageInput.value = "";
  }
}

const chatContainer = document.getElementById("chat-container");
// Exemplo de recebimento de mensagens do servidor
socket.on("message", message => {
  message = JSON.parse(message);
  // Criar o elemento <li>
  var li = document.createElement("li");
  li.className = "w-full flex justify-end";

  // Criar o elemento <p> dentro do <li>
  var p = document.createElement("p");
  p.className = "bg-blue-200 max-w-[80%] mx-6 my-1 block rounded-lg p-3";
  p.textContent = message.content;

  // Adicionar o elemento <p> como filho do elemento <li>
  li.appendChild(p);

  chatContainer.appendChild(li);

  // Aqui você pode adicionar o código para exibir a mensagem na interface do usuário
});
