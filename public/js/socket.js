import { addToaster } from "/js/components/Toaster.js";
import EventEmitter from "./utils/EventEmitter.js";
import { startCountdown } from "./components/countDown.js";
export class Socket {
  constructor() {
    this.init = (options) => io(options);
    this.io = null;
  }
}

export class SocketEvents {
  constructor(io, username) {
    this.io = io;
    this.username = username;
    this.playerList = document.getElementById("playerList");
  }
  connect() {
    const showStateElem = document.getElementById("show-connect-socket");
    this.io.on("connect", (socket) => {
      showStateElem.innerHTML = '<i class="fi fi-br-wifi text-green-500"></i>';

      this.io.on("JoinRequestNotification", (data, callback) => {
        EventEmitter.emit("addtoast", data, (res) => {
          callback(res);
        });
      });

      this.io.on("initgame", (data) => {
        startCountdown(2000, "/game/?id=" + data.roomName);
      });
      // Receber mensagens da sala
      this.io.on("receiveMessage", (message) => {
        console.log("Message from room:", message);
      });
      this.io.on("hi", (callback) => {
        callback("hello");
      });

      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          // Verifica se a página não está oculta
          this.io.emit("refreshsocketid");
        }
      });

      this.io.on("disconnect", (socket) => {
        showStateElem.innerHTML =
          '<i class="fi fi-br-wifi-slash text-red-500"></i>';
        this.pingStatusElement.classList = "ping-very-poor";
        this.pingStatusElement.innerHTML = "<i class='fi fi-br-menu-dots'></i>";
      });
    });

    this.io.on("reconnect_attempt", (attempt) => {
      // ...
      console.log("Reconectando");
    });
  }
  listRooms() {
    this.io.emit("listRooms", (rooms) => {
      console.log(rooms);
    });
  }
  joinGameRoom(roomName) {
    this.io.emit("joinGameRoom", roomName, (data) => {
      console.log(data);
    });
  
  }
  enchangeMovedata(roomName, message) {
    this.io.emit("enchangeMovedata", roomName, message, (data) => {
      console.log(data);
    });
  }
  desconect() {}
  ping() {
    var startTime = Date.now();
    this.pingStatusElement = document.getElementById("ping");
    setInterval(() => {
      startTime = Date.now();
      this.io.emit("ping");
    }, 1000);
    this.io.on("pong", () => {
      const endTime = Date.now();
      const pingTime = endTime - startTime;
      this.pingStatusElement.textContent = pingTime;
      switch (true) {
        case pingTime < 50:
          this.pingStatusElement.className = "ping-excellent";
          break;
        case pingTime < 100:
          this.pingStatusElement.className = "ping-good";
          break;
        case pingTime < 150:
          this.pingStatusElement.className = "ping-acceptable";
          break;
        case pingTime < 250:
          this.pingStatusElement.className = "ping-fair";
          break;
        case pingTime < 500:
          this.pingStatusElement.className = "ping-poor";
          break;
        default:
          this.pingStatusElement.className = "ping-very-poor";
      }
    });
  }

  playerListItem(name, imageSrc) {
    // Criar elemento <li> com classes Tailwind CSS
    this.element = document.createElement("li");
    this.element.classList.add(
      "bg-white",
      "h-16",
      "shadow",
      "flex",
      "border",
      "border-slate-400"
    );

    // Criar elemento <div> para a imagem do jogador
    const imageContainer = document.createElement("div");
    imageContainer.classList.add(
      "border-r",
      "border-r-slate-400",
      "flex",
      "bg-amber-100"
    );
    const image = document.createElement("img");
    image.classList.add("flex-1");
    image.src = imageSrc;
    // image.alt = '';
    imageContainer.appendChild(image);

    // Criar elemento <div> para o nome do jogador
    const nameContainer = document.createElement("div");
    nameContainer.classList.add("flex-1", "py-1", "px-2");
    const nameSpan = document.createElement("span");
    nameSpan.textContent = name;
    nameContainer.appendChild(nameSpan);

    // Criar elemento <div> para os botões
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add(
      "flex",
      "items-center",
      "justify-center",
      "gap-3",
      "px-3",
      "text-xl"
    );
    const removeButton = document.createElement("button");
    removeButton.innerHTML = `
        <i class="fi fi-br-square-x hidden"></i>
        <i class="fi fi-br-checkbox hidden"></i>
        <i class="fi fi-br-square-plus"></i>
    `;
    removeButton.onclick = async () => {
      const data = {
        from: this.username,
        msg: "Vamos jogar",
        for: name,
      };

      this.io.emit("game", data, (res) => {
        //console.log(res);
      });
    };
    const addButton = document.createElement("button");
    addButton.innerHTML = `
        <i class="fi fi-br-user-add"></i>
    `;
    buttonContainer.appendChild(removeButton);
    buttonContainer.appendChild(addButton);

    // Adicionar os elementos criados ao elemento <li>
    this.element.appendChild(imageContainer);
    this.element.appendChild(nameContainer);
    this.element.appendChild(buttonContainer);
    return this.element;
  }

  async listUsers() {
    // Manipular o evento para receber a lista de usuários online
    this.io.emit("onlineUsers", (users) => {
      //console.log(users);
      const ul = document.createElement("ul");
      const otherUsers = users.filter(
        (user) => user.username !== this.username
      );

      this.playerList.innerHTML = "";
      otherUsers.forEach((item) => {
        const li = this.playerListItem(
          item.username,
          "/assets/img/michaelangelo.png"
        );
        this.playerList.appendChild(li);
      });
    });
  }
}
