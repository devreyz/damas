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
      quantityPieces: {
        black: 0,
        white: 0,
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
        EventEmitter.emit("TOGGLE_TURN", this.turn);
      },
      setStateOptions(options) {
        this.turn = options.turn;
        this.playerColor = options.playerColor;
      },
      setSelectedPiece(piece, io) {
        const { position } = piece.getInfo();
        if (this.selectedPiece) this.selectedPiece.piece.isSelected = false;
        this.selectedPiece = piece;
        piece.piece.isSelected = true;

        const data = {
          room: roomId,
          position: position,
        };
      },
      removeSelectedPiece() {
        if (this.selectedPiece) {
          this.selectedPiece.piece.isSelected = false;
          this.selectedPiece = null;
        }
      },
      toggleSelectedPiece(piece, state, data) {
        if (
          this.turn === data.player.color &&
          piece.getInfo("color") === data.player.color
        ) {
          if (state.selectedPiece === null) {
            this.setSelectedPiece(piece);
          } else {
            if (state.selectedPiece === piece) {
              this.removeSelectedPiece();
            } else {
              this.removeSelectedPiece();
              this.setSelectedPiece(piece);
            }
          }
        } else {
          if (piece.getInfo("color") === data.player.color) {
            EventEmitter.emit("IS_NOT_YOUR_TURN", {
              msg: message("notYourTurn"),
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
      capturePiece(row, col) {
        this.state[row][col] = null;
        gameState[row][col] = null;
      },
      // Método para mover uma peça de uma posição para outra
      movePiece(state, newRow, newCol) {
        const { row, column } = this.selectedPiece.getInfo("position");
        const moves = this.selectedPiece.getInfo("possibleMovements");

        const move = moves.find(
          (item) => item.targetPos.x === newCol && item.targetPos.y === newRow
        );
        console.log();
        const verifyTurn = this.turn === this.playerColor;
        const verifyMoves =
          moves &&
          moves.some(
            (item) => item.targetPos.x === newCol && item.targetPos.y === newRow
          );
        if (
          (verifyTurn && verifyMoves) ||
          (true && verifyMoves) ||
          (this.iaTurn && verifyMoves)
        ) {
          this.selectedPiece.move(newRow, newCol);
          this.state[newRow][newCol] = state.state[row][column];
          this.state[row][column] = null;
          gameState[newRow][newCol] = gameState[row][column];
          gameState[row][column] = null;
          if (move.isCapture) {
            this.capturePiece(move.capturePos.y, move.capturePos.x);
          } else {
            this.toggleTurn();
          }
          this.findAllPossiblesPiecesMoves();
          if (this.quantityPieces.white === 0) alert("Vitoria black");
          if (this.quantityPieces.black === 0) alert("Vitoria white");
          if (this.allPossibleMovesInTurn.length === 0) {
            this.toggleTurn();
          }

          EventEmitter.emit("MOVE_MADE", {
            gameState: gameState,
          });
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
      findAllPossiblesPiecesMoves(singlePiece) {
        // Método para encontrar todas as possíveis posições de movimento de uma peça

        game.state.allPossibleMovesInTurn = [];
        this.quantityPieces = {
          black: 0,
          white: 0,
        };

        const getPosForPiece = (piece, x, y,) => {
          const pieceColor = piece.getInfo("color");
          this.quantityPieces[pieceColor]++;
          if (pieceColor === this.turn) {
            const color = piece.getInfo("color")[0];
            const king = piece.getInfo("king");
            const moveDirection = piece.getInfo("moveDirection");
            piece.mapAllMoves(gameState, x, y, {
              color,
              king,
              moveDirection,
            });
          }
        }

        if (singlePiece) {
          const position = singlePiece.getInfo("position")
          const x = position.column
          const y = position.row
           getPosForPiece(singlePiece, x, y);
        } else {
          this.state.forEach((row, y) => {
            row.forEach((piece, x) => {
              if (piece) {
                getPosForPiece(piece, x, y)
              }
            });
          });
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
