export const CheckersBoardFactory = (function () {
  // CheckersBoard Singleton Factory
  let instance; // Instância única do tabuleiro

  function createInstance() {
    const board = [];

    // Inicializa o tabuleiro 10x10
    for (let i = 0; i < 10; i++) {
      board[i] = new Array(10).fill(null);
    }

    // Método para inicializar as peças no tabuleiro
    function initializeBoard() {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 10; col++) {
          if ((row + col) % 2 === 1) {
            board[row][col] = { color: "black", king: false };
          }
        }
      }
      for (let row = 6; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          if ((row + col) % 2 === 1) {
            board[row][col] = { color: "white", king: false };
          }
        }
      }
    }

    // Inicializa as peças no tabuleiro
    initializeBoard();

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
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

