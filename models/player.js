// Definição da classe Player
class Player {
  constructor(socketId, name, room, status, piece) {
    this.socketId = socketId;
    this.name = name;
    this.room = room;
    this.status = status;
    this.piece = piece;
  }
}

// Factory para criar instâncias de jogador
export class PlayerFactory {
  static createPlayer(socketId, name, room, status, piece) {
    return new Player(socketId, name, room, status, piece);
  }
}

