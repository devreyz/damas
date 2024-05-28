import { PieceFactory } from "./PieceFactory.js";
import EventEmitter from "/js/utils/EventEmitter.js";
import { message } from "/js/utils/messages.js";

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
      ia: false,
      iaTurn: false,
      playerColor: undefined,
      state: state,
      allPossibleMovesInTurn: [],
      selectedPiece: null,
      allPieces: {
        black: 0,
        white: 0
      },
      getState() {
        return state;
      },
      toggleTurn() {
        this.turn = this.turn === "black" ? "white" : "black";
        this.iaTurn = !this.iaTurn;
        //this.playerColor = this.playerColor === "black" ? "white" : "black"; //REMOVER ESTA LINHA DEPOIS
        document.getElementById("turnView").classList =
          this.turn === "black"
            ? "bg-orange-400 animate-bounce rounded-full w-6 h-6"
            : "bg-white animate-bounce rounded-full w-6 h-6";
        this.findAllPossiblesPiecesMoves();
        this.removeSelectedPiece();
      },
      setStateOptions(options) {
        this.turn = options.turn;
        this.playerColor = options.playerColor;
      },
      setSelectedPiece(piece) {
        if (this.selectedPiece) this.selectedPiece.piece.isSelected = false;
        this.selectedPiece = piece;
        piece.piece.isSelected = true
      },
      removeSelectedPiece() {
        if (this.selectedPiece) {
          this.selectedPiece.piece.isSelected = false;
          this.selectedPiece = null;
        }
      },
      toggleSelectedPiece(piece, state) {
        if (
          this.turn === this.playerColor &&
          piece.getInfo("color") === this.playerColor
        ) {
          if (state.selectedPiece === null) {
            this.setSelectedPiece(piece);
            //state.selectedPiece = piece;
            //piece.toggleSelect();
          } else {
            if (state.selectedPiece === piece) {
              this.removeSelectedPiece();
              // state.selectedPiece.toggleSelect();
              //state.selectedPiece = null;
            } else {
              this.removeSelectedPiece();
              this.setSelectedPiece(piece);
              //state.selectedPiece.toggleSelect();
              //piece.toggleSelect();
              //state.selectedPiece = piece;
            }
          }
        } else {
          console.log(piece.getInfo());
          if (piece.getInfo("color") === this.playerColor) {
            EventEmitter.emit("IS_NOT_YOUR_TURN", {
              msg: message("notYourTurn")
            });
          } else {
            EventEmitter.emit("IS_NOT_YOUR_PIECE", {
              msg: "Está peça pertence ao outro jogador!"
            });
          }
        }
      },
      // Método para obter uma peça em uma posição específica
      getPiece(row, col) {
        return state[row][col];
      },
      capturePiece(row, col) {
        //  console.log(row,col)
        this.state[row][col] = null;
        this.allPieces[this.turn === "black" ? "white" : "black"]--;
        //console.log(this.allPieces);
      },
      // Método para mover uma peça de uma posição para outra
      movePiece(state, newRow, newCol) {
        const { row, column } = this.selectedPiece.getInfo("position");
        const moves = this.selectedPiece.getInfo("possibleMovements");
        const move = moves.find(
          item => item.movePos.col === newCol && item.movePos.row === newRow
        );
        // console.log(move)
        const verifyTurn = this.turn === this.playerColor;
        const verifyMoves =
          moves &&
          moves.some(
            item => item.movePos.col === newCol && item.movePos.row === newRow
          );
        if ((verifyTurn && verifyMoves) || (this.iaTurn && verifyMoves)) {
          //console.log(this.selectedPiece);
          const test = state.state[row][column];
          this.selectedPiece.move(newRow, newCol);
          this.state[newRow][newCol] = state.state[row][column];
          this.state[row][column] = null;
          // this.state[newRow][newCol] = test
          if (move.isCapture) {
            this.capturePiece(move.capturePiece.row, move.capturePiece.col);
            //  console.log(move.capturePiece.row)
            //throw new Error()
          } else {
            this.toggleTurn();
          }
          this.findAllPossiblesPiecesMoves();
          if (this.allPossibleMovesInTurn.length === 0) {
            //console.log("Sem jogadas");
            this.toggleTurn();
          }

          EventEmitter.emit("MOVE_MADE", {
            msg: "Jogou"
          });
        } else {
          EventEmitter.emit("INVALID_MOVE", {
            msg: "Jogada inválida!"
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
        // Método para encontrar todas as possíveis posições de movimento de uma peça

        game.state.allPossibleMovesInTurn = [];
        this.state.forEach((row, y) => {
          row.forEach((piece, x) => {
            if (piece) {
              //alert(`err`)
              piece.findPossiblesMoves(this.state);
            }
          });
        });
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
