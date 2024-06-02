import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import mysql from "mysql";
import dotenv from "dotenv";
import { Routes } from "./routes/Routes.js";
import { UserManager } from "./models/UserManager.js";
import cookieParser from "cookie-parser";

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
    this.userManager = new UserManager();
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
      database: process.env.DB_NAME
    });

    this.app.use(express.static(path.join(__dirname, "public"))); // Configura o middleware para servir arquivos estáticos
    this.app.use(express.urlencoded({ extended: true })); // Configura o middleware para decodificar dados de formulário
    this.app.use(cookieParser()); // Configura o middleware para analisar cookies

    this.listenSocket(); // Configura os eventos do Socket.IO
    this.routes = new Routes(
      this.app,
      this.conn,
      this.rooms,
      this.userManager.connections
    ); // Configura as rotas do aplicativo
  }

  /**
   * Método para iniciar o servidor HTTP.
   */
  listenServer() {
    this.app.use(express.json()); // Configura o middleware para decodificar JSON

    this.conn.connect(err => {
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
    this.io.on("connection", socket => {
      // Configura os eventos para quando um usuário se conecta
      const username = socket.handshake.auth.username; // Obtém o nome de usuário do handshake
      if (username) {
        this.userManager.addUser(socket, username);

        socket.emit(
          "PLAYER_CONNECTED",
          this.userManager.getUserByUsername(username)
        );

        socket.on("QUIT_GAME_ROOM", quit => {
          //socket.leave(room);
          this.userManager.connections[username].room = null;
          quit();
          console.log("Saiu da sala");
        });

        socket.on("ping", () => {
          // Configura o evento ping-pong para verificar a conexão
          socket.emit("pong");
        });

        socket.on("onlineUsers", callback => {
          // Configura o evento para obter usuários online
          callback(Object.values(this.userManager.connections));
        });

        socket.on("listRooms", callback => {
          //console.log("Listar salas chamado")
          callback(this.rooms);
        });

        socket.on("joinGameRoom", (roomName, callback) => {
          console.log("Entrou na sala: ", roomName);
          socket.join(roomName);
          //console.log(`User joined room  ${roomName}`);
          callback(this.rooms[roomName]);
        });

        // Sair de uma sala específica
        socket.on("leaveRoom", room => {
          socket.leave(room);
          console.log(`User left room ${room}`);
        });

        // Enviar mensagem para todos os sockets em uma sala
        socket.on("enchangeMoveData", () => {});
        socket.on("SELECT_PIECE", (data, callback) => {
          //console.log(data);
          socket
            .to(data.room)
            .timeout(5000)
            .emit("IN_ROOM_SELECT_PIECE", data, (err, res) => {
              if (err) {
                callback(false);
              } else {
                callback(res);
              }
            });
        });

        socket.on("game", (data, callback) => {
          if (this.userManager.getUserByUsername(data.from).room === null) {
            // Configura o evento para iniciar um jogo
            const playerFrom = this.userManager.getUserByUsername(data.from);
            const playerTo = this.userManager.getUserByUsername(data.for);

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
                    const roomName = crypto.randomUUID(); // Crie um id randômico para a sala
                    // Emite o evento de inicialização do jogo para ambos os jogadores

                    this.io.to(playerFrom.id).emit("initgame", { roomName });
                    this.io.to(playerTo.id).emit("initgame", { roomName });
                    const usernameFrom = playerFrom.username;
                    const usernameTo = playerTo.username;
                    playerFrom.room = roomName;
                    playerTo.room = roomName;
                    const playerColor = Math.floor(Math.random() * 2 + 1);
                    console.log(playerColor);
                    this.rooms[roomName] = {
                      [usernameFrom]: {
                        ...playerFrom,
                        playerColor: playerColor === 1 ? "white" : "black"
                      },
                      [usernameTo]: {
                        ...playerTo,
                        playerColor: playerColor === 1 ? "black" : "white"
                      },
                      turn:
                        Math.floor(Math.random() * 2) === 1 ? "white" : "black"
                    };
                    //console.log('Salas: ', this.rooms)
                  } else {
                    callback(false);
                  }
                }
              });
          } else {
            callback({ status: "jogando" });
          }
        });

        socket.on("update-socket-id", (username, newSocketId) => {
          this.userManager.updateSocketId(username, newSocketId);
        });

        socket.on("reconnect", username => {
          this.userManager.handleReconnect(socket, username);
        });

        socket.on("disconnect", () => {
          const username = Object.keys(this.userManager.connections).find(
            key => this.userManager.connections[key].id === socket.id
          );
          if (username) {
            this.userManager.handleDisconnect(socket, username);
          }
        });
      } else {
        console.error("Username is required for connection.");
        socket.disconnect();
      }
    });
  }
}

const app = new App(); // Cria uma instância da classe App
app.listenServer(); // Inicia o servidor HTTP
