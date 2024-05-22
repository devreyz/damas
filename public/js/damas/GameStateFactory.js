import { PieceFactory } from "./PieceFactory.js";
import EventEmitter from "/js/utils/EventEmitter.js";

export const GameStateFactory = (function () {
  // CheckersBoard Singleton Factory
  let instance; // Instância única do tabuleiro
  let createPieceFactory = PieceFactory();

  function createInstance(stateMatrix) {
    const state = [];

    // Metodo para inicializar as peças no tabuleiro
    function initializeState() {
      stateMatrix.forEach((row, y) => {
        state[y] = [];
        row.forEach((item, x) => {
          switch (item) {
            case "w":
              state[y][x] = createPieceFactory.createPiece(
                "white",
                x,
                y,
                false
              );
              break;

            case "W":
              state[y][x] = createPieceFactory.createPiece("white", x, y, true);
              break;

            case "b":
              state[y][x] = createPieceFactory.createPiece(
                "black",
                x,
                y,
                false
              );
              break;

            case "B":
              state[y][x] = createPieceFactory.createPiece("black", x, y, true);
              break;

            default:
              state[y][x] = null;
          }
        });
      });
    }

    // Inicializa
    initializeState();

    return {
      turn: undefined,
      playerColor: undefined,
      state: state,

      selectedPiece: null,
      getState() {
        return state;
      },
      toggleTurn() {
        this.turn = this.turn === "black" ? "white" : "black";
        this.playerColor = this.playerColor === "black" ? "white" : "black"; //REMOVER ESTA LINHA DEPOIS
        document.getElementById("turnView").classList =
          this.turn === "black"
            ? "bg-orange-400 rounded-full w-6 h-6"
            : "bg-white rounded-full w-6 h-6";
        this.findAllPossiblesPiecesMoves()
        if(this.selectedPiece)this.selectedPiece.piece.isSelected = false
        this.selectedPiece = null
      },
      setStateOptions(options) {
        this.turn = options.turn;
        this.playerColor = options.playerColor;
      },
      toggleSelectedPiece(piece, state) {
        if (
          this.turn === this.playerColor &&
          piece.getInfo("color") === this.playerColor
        ) {
          if (state.selectedPiece === null) {
            state.selectedPiece = piece;
            piece.toggleSelect();
          } else {
            if (state.selectedPiece === piece) {
              state.selectedPiece.toggleSelect();
              state.selectedPiece = null;
            } else {
              state.selectedPiece.toggleSelect();
              piece.toggleSelect();
              state.selectedPiece = piece;
            }
          }
        } else {
          if (piece.getInfo("color") === this.playerColor) {
            EventEmitter.emit("IS_NOT_YOUR_TURN", {
              msg: "Ainda não e sua vez!",
            });
          } else {
            EventEmitter.emit("IS_NOT_YOUR_PIECE", {
              msg: "Está peça pertence ao outro jogador!",
            });
          }
        }
      },
      // Método para obter uma peça em uma posição específica
      getPiece(row, col) {
        return state[row][col];
      },
      // Método para mover uma peça de uma posição para outra
      movePiece(state, newRow, newCol) {
        const { row, column } = this.selectedPiece.getInfo("position");
        const moves = this.selectedPiece.getInfo("possibleMovements");
        
        const verifyTurn = this.turn === this.playerColor
        const verifyMoves = moves && moves.some((item) => item.col === newCol && item.row === newRow)
        if (verifyTurn && verifyMoves) {
          //console.log(this.selectedPiece);
          this.selectedPiece.move(newRow, newCol);
          this.state[newRow][newCol] = state.state[row][column];
          this.state[row][column] = null;
          this.findAllPossiblesPiecesMoves();
          this.toggleTurn()
        } else {
          EventEmitter.emit("INVALID_MOVE", {
            msg: "Jogada inválida!",
          });
        }
      },
      // Método para promover uma peça a dama
      promotePiece(row, col) {
        if (state[row][col]) {
          state[row][col].king = true;
        }
      },
      findAllPossiblesPiecesMoves() {
        console.log('Iniciando Busca!');

        // Método para encontrar todas as possíveis posições de movimento de uma peça
        this.state.forEach((row, y) => {
          row.forEach((piece, x) => {
            if (piece) piece.findPossiblesMoves(this.state);
          });
        });
        console.log("Busca Finalizada!")
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
