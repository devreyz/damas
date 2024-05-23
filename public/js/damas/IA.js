import EventEmitter from "/js/utils/EventEmitter.js";
import { message } from "/js/utils/messages.js";

export function IAFactory() {
  function createIA(name, { gameState, pieceColor, qi }) {
    const ia = {};

    ia.name = name;
    ia.gameState = gameState;
    gameState.ia = true;

    ia.pieceColor = pieceColor;
    ia.qi = qi || 1;

    ia.on = () => {
      EventEmitter.emit("IA_MESSAGE", {
        msg: `Olá sou ${ia.name} eu irei jogar com você!`,
        color: ia.pieceColor
      });

      // Ouvindo eventos de jogada
      EventEmitter.on("MOVE_MADE", data => {
        setTimeout(() => {
          ia.processMove(data);
        }, 100);
      });
      setTimeout(() => {
        EventEmitter.emit("IA_MESSAGE", {
          msg: `Eu jogarei com as peças ${
            ia.pieceColor === "black" ? "Pretas" : "Brancas"
          }, OK! `,
          color: ia.pieceColor
        });
      }, 2000);
    };

    ia.processMove = function (moveData) {
      const { turn, action } = moveData;

      if (game.state.turn === ia.pieceColor) {
        game.state.iaTurn = true;
        setTimeout(() => {
          this.makeMove();
        }, 1000 / ia.qi);
      }
    };

    ia.makeMove = () => {
      setTimeout(() => {
        EventEmitter.emit("IA_MESSAGE", {
          msg: message("aiTurn"),
          color: ia.pieceColor
        });
        const move = ia.getMove();
        //if(move.isCapture) game.state.capturePiece()
        const piece = game.state.getPiece(move.piecePos.row, move.piecePos.col);
        piece.piece.isSelected = true;
        game.state.setSelectedPiece(piece);
        setTimeout(() => {
          game.state.movePiece(game.state, move.movePos.row, move.movePos.col);
        }, 2000 / ia.qi);
      }, 3000 / ia.qi);
    };

    ia.getMove = () => {
      const moves = gameState.allPossibleMovesInTurn;
      return moves[
        Math.floor(Math.random() * gameState.allPossibleMovesInTurn.length)
      ];
    };

    return ia;
  }

  // Public interface of the factory
  return {
    createIA: createIA
  };
}
