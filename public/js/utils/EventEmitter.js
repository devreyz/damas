class EventEmitter {
  constructor() {
    this.events = {};
  }

  // Método para inscrever um evento
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    return this; // Permitir encadeamento de métodos
  }

  // Método para emitir um evento
  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => {
        callback(...args);
      });
    }
    return this; // Permitir encadeamento de métodos
  }

  // Método para remover um evento específico
  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (cb) => cb !== callback
      );
    }
    return this; // Permitir encadeamento de métodos
  }

  // Método para remover todos os listeners de um evento
  removeAllListeners(eventName) {
    delete this.events[eventName];
    return this; // Permitir encadeamento de métodos
  }

  // Método para uma vez escutar um evento
  once(eventName, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(eventName, onceCallback);
    };
    return this.on(eventName, onceCallback); // Permitir encadeamento de métodos
  }

  // Método para contar o número de ouvintes de um evento
  listenerCount(eventName) {
    return this.events[eventName] ? this.events[eventName].length : 0;
  }

  // Método para listar os nomes de todos os eventos
  eventNames() {
    return Object.keys(this.events);
  }
}

// Exportar uma instância única da classe EventEmitter
export default new EventEmitter();
