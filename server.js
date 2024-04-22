import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import mysql from "mysql";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { Routes } from "./routes/Routes.js";
import cookieParser from "cookie-parser";

// import { Routes } from "./routes/Routes.js";
global.__dirname = path.resolve();

dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
    this.io = new Server(this.http);

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
    this.app.use(express.static("public"));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use;
    this.listenSocket();
    this.routes = new Routes(this.app, this.conn);

    this.connections = {};
    this.conversations = {};
  }
  listenServer() {
    this.app.use(express.json());
    this.conn.connect((err) => {
      if (err) throw err;
      this.http.listen(3000, () => console.log("Server is running"));
    });
    // Inicialize o servidor na porta 3000
  }
  listenSocket() {
    this.io.on("connection", (socket) => {
      this.connections[socket.id] = socket;

      console.log("Conectado usuário com id: " + socket.id);

      socket.on("message", (msg) => {
        const data = JSON.parse(msg);
        const { sender, recipient, content } = data;

        // Encaminhar a mensagem para o destinatário correto
        if (recipient in this.connections) {
          const recipientSocket = this.connections[recipient];
          const conversationId = [sender, recipient].sort().join("-");

          // Armazenar a mensagem na conversa
          if (!(conversationId in this.conversations)) {
            this.conversations[conversationId] = [];
          }
          this.conversations[conversationId].push({ sender, content });

          // Enviar a mensagem para o destinatário
          this.io.emit("message", JSON.stringify({ sender, content }));
        }
      });
      socket.on("disconnect", () => {
        // Remover a conexão ao fechar
        console.log("Desconectado: ", socket.id);
        delete this.connections[socket.id];
      });
    });
  }
}

const app = new App();
app.listenServer();
