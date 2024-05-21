export const CheckersBoardFactory = (function () {
  // CheckersBoard Singleton Factory
  let instance; // Instância única do tabuleiro

  function createInstance(state) {
    const board = state

    
  
    return {
      
      getBoard() {
        return board;
      },
      // Método para obter uma peça em uma posição específica
      getPiece(row, col) {
        return board[row][col];
      },
      // Método para mover uma peça de uma posição para outra
      movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = board[fromRow][fromCol];
        board[fromRow][fromCol] = null;
        board[toRow][toCol] = piece;
      },
      // Método para promover uma peça a dama
      promotePiece(row, col) {
        if (board[row][col]) {
          board[row][col].king = true;
        }
      },
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

