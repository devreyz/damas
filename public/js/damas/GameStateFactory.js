import { PieceFactory } from "./PieceFactory.js";

export const GameStateFactory = (function () {
  // CheckersBoard Singleton Factory
  let instance; // Instância única do tabuleiro
  let createPieceFactory = PieceFactory();

  function createInstance(stateMatrix) {
    const state = [];
    
    // Metodo para inicializar as peças no tabuleiro
    function initializeState() {
      stateMatrix.forEach((row, y) => {
        state[y] = []
        row.forEach((item, x) => {
          switch (item) {
            case "w":
              state[y][x] = createPieceFactory.createPiece("white", x, y, false);
              break;
              
            case "W":
              state[y][x] = createPieceFactory.createPiece("white", x, y, true);
              break;
              
            case "b":
              state[y][x] = createPieceFactory.createPiece("black", x, y, false);
              break;
              
            case "B":
              state[y][x] = createPieceFactory.createPiece("black", x, y, true);
              break;
              
            default:
              state[y][x] = null
          }
        });
      });
    }
    
    // Inicializa
    initializeState();
    
    return {
      getState() {
        return state;
      },
      // Método para obter uma peça em uma posição específica
      getPiecePos(row, col) {
        return state[row][col];
      },
      // Método para mover uma peça de uma posição para outra
      movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = state[fromRow][fromCol];
        state[fromRow][fromCol] = null;
        state[toRow][toCol] = piece;
      },
      // Método para promover uma peça a dama
      promotePiece(row, col) {
        if (state[row][col]) {
          state[row][col].king = true;
        }
      }
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
