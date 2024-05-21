export const CheckersBoardFactory = (function () {
  // CheckersBoard Singleton Factory
  let instance; // Instância única do tabuleiro

  function createInstance(state) {
    const board = state

  
    return {
      state,
     
    };
  }

  return {
    getInstance(state) {
      if (!instance) {
        instance = createInstance(state);
      }
      return instance;
    },
  };
})();

