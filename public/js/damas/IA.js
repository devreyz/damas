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
    ia.qi = ia.qi / 37;

    ia.on = () => {
      EventEmitter.emit("IA_MESSAGE", {
        msg: `Olá sou ${ia.name} eu irei jogar com você!`,
        color: ia.pieceColor
      });
      // Ouvindo eventos de jogada
      EventEmitter.on("MOVE_MADE", data => {
        setTimeout(() => {
          ia.processMove(data);
        }, 200);
      });
      setTimeout(() => {
        EventEmitter.emit("IA_MESSAGE", {
          msg: `Eu jogarei com as peças ${
            ia.pieceColor === "black" ? "Pretas" : "Brancas"
          }, OK! `,
          color: ia.pieceColor
        });
      }, 3000);
    };
    ia.processMove = function () {
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
        console.log(
          "Player: " +
            ia.name +
            ", moveu a peça da posição - l: " +
            move.initPos.y +
            ", c: " +
            move.initPos.x +
            ". MoveType: " +
            move.moveType
        );
        //if(move.isCapture) game.state.capturePiece()
        const piece = game.state.getPiece(move.initPos.y, move.initPos.x);
        piece.piece.isSelected = true;
        game.state.setSelectedPiece(piece);
        setTimeout(() => {
          game.state.movePiece(game.state, move.targetPos.y, move.targetPos.x);
        }, 2000 / ia.qi);
      }, 3000 / ia.qi);
    };
    ia.getMove = () => {
      let moves = gameState.allPossibleMovesInTurn;
      const captureMoves = moves.filter(item => item.isCapture === true);
      if (captureMoves.length > 0) moves = captureMoves;
      //console.log(captureMoves)
      return moves[Math.floor(Math.random() * moves.length)];
    };
    return ia;
  }
  // Public interface of the factory
  return {
    createIA: createIA
  };
}
