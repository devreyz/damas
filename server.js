import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import mysql from "mysql";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { Routes } from "./routes/Routes.js";
import cookieParser from "cookie-parser";
import { log } from "console";

// import { Routes } from "./routes/Routes.js";
global.__dirname = path.resolve();

dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
    this.io = new Server(this.http);

    this.connections = {};
    this.conversations = {};
    this.initialize();
  }
  initialize() {
    this.conn = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    // Defina o diretório onde seus arquivos estáticos (CSS, JavaScript, imagens, etc.) estão localizados
    this.app.use(express.static(path.join(__dirname, "public")));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use;
    this.listenSocket();
    this.routes = new Routes(this.app, this.conn);
  }
  listenServer() {
    this.app.use(express.json());
    this.conn.connect((err) => {
      if (err) throw err;
      this.http.listen(3000, () =>
        console.log("Server is running, in http://localhost:3000/")
      );
    });
    // Inicialize o servidor na porta 3000
  }

  listenSocket() {
    this.io.on("connection", (socket) => {
      const username = socket.handshake.auth.username;
      this.connections[username] = {
        id: socket.id,
        username: username,
      };
      //console.log(this.connections);

      //socket.broadcast.emit("player_connected", {msg: "Um novo jogador se conectou!"});
      socket.on("ping", () => {
        socket.emit("pong");
      });

      this.io.emit("onlineUsers", Object.values(this.connections));

      socket.on("game", (data, callback) => {
        this.io
          .to(this.connections[data.for].id)
          .timeout(5000)
          .emit("letsGo", data, (err, res) => {
            if (err) {
              callback("Tempo esgotado");
            } else {
              if (res == true) {
                callback(data.for + " aceitou o desafio");
              } else {
                callback(data.for + " recusou o desafio");
              }
              console.log("Consegui " + res);
            }
          });
      });

      socket.on("disconnect", () => {
        delete this.connections[username];

        this.io.emit("onlineUsers", Object.values(this.connections));
      });
    });
  }
}

const app = new App();
app.listenServer();
