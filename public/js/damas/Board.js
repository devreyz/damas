export const CheckersBoardFactory = (function () {
  // CheckersBoard Singleton Factory
  let instance; // Instância única do tabuleiro

  function createInstance(state) {
    const board = {
      colors: {
        // Definindo as cores
        lightTile: "#FFFFFF", // Laranja claro
        darkTile: "#FFD700",
        lightPiece: "#FFD700",
        darkPiece: "#AA9700",
        white: "#FFFFFF", // Branco
        brown: "#8B4513", // Marrom
        gray: "#D3D3D3", // Cinza
        orangeLighter: "#FFD700", // Laranja mais claro
        whiteOff: "#FFFFF0" // Branco off-white
      }
    };

    return {
      state,
      board
    };
  }

  return {
    getInstance(state) {
      if (!instance) {
        instance = createInstance(state);
      }
      return instance;
    }
  };
})();
