export class UserManager {
  constructor() {
    this.connections = {};
  }

  addUser(socket, username) {
    const existingUser = this.getUserByUsername(username);
    if (existingUser) {
      this.updateSocketId(username, socket.id);
      this.connections[username].isConnected = true;
      console.log(`User ${username} reconnected with updated ID: ${socket.id}`);
    } else {
      this.connections[username] = {
        id: socket.id,
        username: username,
        isConnected: true,
        room: null
      };
      console.log(`User ${username} connected with ID: ${socket.id}`);
    }
    
      
  }

  removeUser(username) {
    if (
      this.connections[username] &&
      this.connections[username].isConnected === false
    ) {
      //clearTimeout(this.connections[username].timeoutId);
      delete this.connections[username];
      console.log(`Usuario ${username} removido`);
    } else {
      console.log(`Usuario ${username} não foi removido`);
    }
  }

  handleDisconnect(socket, username) {
    if (this.connections[username]) {
      this.connections[username].isConnected = false;

      // Set a timeout to remove the user after 1 minute if they don't reconnect
      setTimeout(() => {
        this.removeUser(username);
      }, 30000); // 60000 ms = 1 minute

      console.log(`User ${username} disconnected. Waiting for reconnection...`);
    }
  }

  handleReconnect(socket, username) {
    if (this.connections[username]) {
      //clearTimeout(this.connections[username].timeoutId);
      this.connections[username].id = socket.id;
      this.connections[username].isConnected = true;
      console.log(`User ${username} reconnected with ID: ${socket.id}`);
    } else {
      this.addUser(socket, username);
    }
  }

  updateSocketId(username, newSocketId) {
    if (this.connections[username]) {
      this.connections[username].id = newSocketId;
      console.log(`Updated socket ID for user ${username} to ${newSocketId}`);
    }
  }

  getUserByUsername(username) {
    return this.connections[username] || null;
  }
}
