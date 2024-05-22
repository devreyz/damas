import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import mysql from "mysql";
import dotenv from "dotenv";
import { Routes } from "./routes/Routes.js";
import cookieParser from "cookie-parser";

// import { Routes } from "./routes/Routes.js";
global.__dirname = path.resolve();

dotenv.config();

/**
 * Classe principal do aplicativo.
 */
class App {
  /**
   * Construtor da classe App.
   */
  constructor() {
    this.app = express(); // Inicializa o express
    this.http = http.createServer(this.app); // Cria o servidor HTTP
    this.io = new Server(this.http); // Inicializa o Socket.IO
    this.connections = {}; // Armazena informações sobre as conexões dos usuários
    this.rooms = {}; // Armazena informações sobre as salas
    this.initialize(); // Inicializa o aplicativo
  }

  /**
   * Método para inicializar o aplicativo.
   */
  initialize() {
    this.conn = mysql.createConnection({
      // Cria a conexão com o banco de dados MySQL
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    this.app.use(express.static(path.join(__dirname, "public"))); // Configura o middleware para servir arquivos estáticos
    this.app.use(express.urlencoded({ extended: true })); // Configura o middleware para decodificar dados de formulário
    this.app.use(cookieParser()); // Configura o middleware para analisar cookies

    this.listenSocket(); // Configura os eventos do Socket.IO
    this.routes = new Routes(this.app, this.conn); // Configura as rotas do aplicativo
  }

  /**
   * Método para iniciar o servidor HTTP.
   */
  listenServer() {
    this.app.use(express.json()); // Configura o middleware para decodificar JSON

    this.conn.connect((err) => {
      // Conecta-se ao banco de dados MySQL
      if (err) throw err;
      this.http.listen(3000, () =>
        // Inicia o servidor HTTP
        console.log("Server is running, in http://localhost:3000/")
      );
    });
  }

  /**
   * Método para lidar com eventos do Socket.IO.
   */
  listenSocket() {
    this.io.on("connection", (socket) => {
      // Configura os eventos para quando um usuário se conecta
      const username = socket.handshake.auth.username; // Obtém o nome de usuário do handshake
      this.connections[username] = {
        // Armazena informações sobre a conexão do usuário
        id: socket.id,
        username: username,
        isConected: true,
      };
      const player = this.connections[username];
      // console.log(this.rooms);

      socket.on("refreshsocketid", () => {
        //  Atualiza o socket.id do jogador quando o jogo entra em foco
        this.connections[username].id = socket.id;
      });

      socket.on("ping", () => {
        // Configura o evento ping-pong para verificar a conexão
        socket.emit("pong");
      });

      socket.on("onlineUsers", (cd) => {
        // Configura o evento para obter usuários online
        cd(Object.values(this.connections));
      });

      socket.on("listRooms", (callback) => {
        //console.log("Listar salas chamado")
        callback(this.rooms);
      });

      socket.on("joinGameRoom", (roomName, callback) => {
        socket.join(roomName);
        console.log(`User joined room  ${roomName}`);
        callback({ msg: "Entrou na sala" });
      });

      // Sair de uma sala específica
      socket.on("leaveRoom", (room) => {
        socket.leave(room);
        console.log(`User left room ${room}`);
      });

      // Enviar mensagem para todos os sockets em uma sala
      socket.on("enchangeMoveData", (room, message, callback) => {
        console.log("Ola");
        callback({msg: "re"})
        io.to(room).emit("receiveMessage", message);
      });

      socket.on("game", (data, callback) => {
        // Configura o evento para iniciar um jogo
        const playerFrom = this.connections[data.from];
        const playerTo = this.connections[data.for];

        // Emite uma notificação de solicitação de jogo para o outro jogador
        this.io
          .to(playerTo.id)
          .timeout(5000)
          .emit("JoinRequestNotification", data, (err, res) => {
            if (err) {
              callback(false);
            } else {
              if (res[0]) {
                callback(true);
                const roomName = crypto.randomUUID(); // Crie  um id randômico para a sala
                // Emite o evento de inicialização do jogo para ambos os jogadores

                this.io.to(playerFrom.id).emit("initgame", { roomName });
                this.io.to(playerTo.id).emit("initgame", { roomName });
                const usernameFrom = playerFrom.username;
                const usernameTo = playerTo.username;
                this.rooms[roomName] = {
                  [usernameFrom]: playerFrom,
                  [usernameTo]: playerTo,
                  turn: null,
                };
              } else {
                callback(false);
              }
            }
          });
      });

      socket.on("disconnect", () => {
        if (this.connections[username]) {
          // Configura o evento para quando um usuário se desconecta
          try {
            this.connections[username].isConected = false;
            setTimeout(() => {
              // Define um timeout para excluir as informações do usuário após 10 segundos
              if (
                this.connections[username] &&
                !this.connections[username].isConected
              ) {
                this.io
                  .to(this.connections[username].id)
                  .timeout(5000)
                  .emit("hi", (err, res) => {
                    if (err || res[0] !== "hello") {
                      delete this.connections[username];
                      console.log("Usuario removido: " + username);
                    } else {
                      console.log(res);
                    }
                  });
              }
            }, 30000);
          } catch (error) {
            console.log(error);
          }
        }
      });
    });
  }
}

const app = new App(); // Cria uma instância da classe App
app.listenServer(); // Inicia o servidor HTTP
