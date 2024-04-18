import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

global.__dirname = path.resolve();


class App {
  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
    this.io = new Server(this.http);
    // Defina o diretório onde seus arquivos estáticos (CSS, JavaScript, imagens, etc.) estão localizados
    this.app.use(express.static('public'))
    this.listenSocket();
    this.setRoutes();

    this.connections = {};
    this.conversations = {};
  }
  listenServer() {
    this.http.listen(3000, () => console.log("Server is running"));
  }
  listenSocket() {
    this.io.on("connection", socket => {
      this.connections[socket.id] = socket;

      console.log("Conectado usuário com id: " + socket.id);

      socket.on("message", msg => {
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
          recipientSocket.emit("message", JSON.stringify({ sender, content }));
        }
      });
      socket.on("disconnect", () => {
        // Remover a conexão ao fechar
        console.log('Desconectado: ', socket.id)
        delete this.connections[socket.id];
      });
    });
  }
  setRoutes() {
    this.app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));
  }
}

const app = new App();
app.listenServer();
