// CheckersPiece Factory Function
export function PieceFactory() {
  // Function to create a new piece
  function createPiece(color, column, row, isKing, state) {
    return {
      id: crypto.randomUUID(),
      piece: {
        color: String(color), // 'white' or 'black'
        king: Boolean(isKing), // if it is a king piece or not
        isSelected: false,
        position: {
          row: row,
          col: column,
        },
        possibleMovements: [
          /*
          {
            moveTipe: SIMPLE || KING || CAPTURE || KING_CAPTURE,
            lastPos: {x: 0, y:0},
            nextPos: {x: 1, y:1},
            capturePiece: Piece || null
          }
          */
        ],
        // Other attributes can be added as needed
      },

      // Method to move the piece
      move(newRow, newColumn) {
        this.piece.position.row = newRow;
        this.piece.position.col = newColumn;
      },

      // Method to promote the piece to king
      promote() {
        this.piece.king = true;
      },

      // Method to get piece information
      getInfo(prop) {
        if (prop) {
          return this.piece[prop];
        }
        return {
          color: this.piece.color,
          king: this.piece.king,
          position: this.piece.position,
          isSelected: this.piece.isSelected,
          possibleMovements: this.piece.possibleMovements,
        };
      },

      // Method to check if the piece is a king
      isKing() {
        return this.piece.king;
      },

      // Method to get the current position of the piece
      getPosition() {
        return this.piece.position;
      },

      toggleSelect() {
        this.piece.isSelected = !this.piece.isSelected;
      },

      // Method to set the position of the piece
      setPosition(row, col) {
        this.piece.position.row = row;
        this.piece.position.column = col;
      },
      findPossiblesMoves(state) {
        const piece = this;
        let { color, king, possibleMovements } = this.piece;
        let row = this.piece.position.row;
        let col = this.piece.position.col;
        const turn = game.state.turn;

        possibleMovements.push(...calculatePossiblesMoves(1, 1));
        possibleMovements.push(...calculatePossiblesMoves(-1, 1));
        possibleMovements.push(...calculatePossiblesMoves(-1, -1));
        possibleMovements.push(...calculatePossiblesMoves(1, -1));

        function calculatePossiblesMoves(x, y) {
          let moves = [];
          let newRow = row + y;
          let newCol = col + x;
          if (
            newRow >= 0 &&
            newRow < 10 &&
            newCol >= 0 &&
            newCol < 10 &&
            color === turn
          ) {
            if (state[newRow][newCol] === null) {
              //console.log({ msg: "Livre", newRow, newCol });
              moves.push({ row: newRow, col: newCol });
            } else {
              if (state[newRow][newCol].piece.color !== color) {
                //console.log({ msg: "Inimigo", newRow, newCol });
              } else {
                //console.log({ msg: "Amigo", newRow, newCol });
              }
            }
          }
          // console.table({
          //   row,
          //   col,
          //   newRow,
          //   newCol,
          // });
          return moves;
        }
        //console.log(state[newRow][newCol].piece.color);
      },
    };
  }
  // Public interface of the factory
  return {
    createPiece: createPiece,
  };
}
