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
        inAlert: false,
        position: {
          row: row,
          column: column
        },
        lastPosition: {
          row: row,
          column: column
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
        moveDirection: color === "black" ? 1 : -1
        // Other attributes can be added as needed
      },

      // Method to move the piece
      move(newRow, newColumn) {
        this.piece.position.row = newRow;
        this.piece.position.column = newColumn;

        const rowPromote =
          this.piece.moveDirection === 1 ? game.board.boardLength - 1 : 0;
        if (rowPromote === newRow) this.promote();
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
          lastPosition: this.piece.lastPosition,
          isSelected: this.piece.isSelected,
          possibleMovements: this.piece.possibleMovements,
          inAlert: this.piece.inAlert
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
      setPosition(newRow, newCol) {
        this.piece.position.row = newRow;
        this.piece.position.column = newCol;
      },
      findPossiblesMoves(state) {
        const piece = this.piece;
        piece.possibleMovements = [];
        piece.inAlert = false;
        let possibleMovements = [];
        let { color, king } = piece;
        
        
        let { row, column: col } = piece.position;
        const turn = game.state.turn;
        

        possibleMovements.push(
          ...calculatePossiblesMoves(col + 1, row + 1, 1, 1, false)
        );
        possibleMovements.push(
          ...calculatePossiblesMoves(col - 1, row + 1, -1, 1, false)
        );
        possibleMovements.push(
          ...calculatePossiblesMoves(col - 1, row - 1, -1, -1, false)
        );
        possibleMovements.push(
          ...calculatePossiblesMoves(col + 1, row - 1, 1, -1, false)
        );

        function calculatePossiblesMoves(
          newCol,
          newRow,
          offSetCol,
          offSetRow,
          isCapture
        ) {
          let moves = [];
          if (
            newRow >= 0 &&
            newRow < 10 &&
            newCol >= 0 &&
            newCol < 10 &&
            color === turn
          ) {
            if (state[newRow][newCol] === null) {
              if (
                piece.moveDirection === offSetRow ||
                king ||
                isCapture
              ) {
                if (king) {
                //   console.log({offSetRow, offSetCol})
                //   console.log(calculatePossiblesMoves(
                //   newCol + offSetCol,
                //   newRow + offSetRow,
                //   offSetCol,
                //   offSetRow,
                //   false
                // ))
                //throw new Error()
                }
                let item = {
                  piecePos: {
                    row: piece.position.row,
                    col: piece.position.column
                  },
                  isCapture: isCapture,
                  capturePiece: {
                    row: null,
                    col: null
                  },
                  movePos: {
                    row: newRow,
                    col: newCol
                  }
                };
                game.state.allPossibleMovesInTurn.push(item);
                moves.push(item);
              }
            } else {
              if (state[newRow][newCol].piece.color !== color && !isCapture ) {
                calculatePossiblesMoves(
                  newCol + offSetCol,
                  newRow + offSetRow,
                  offSetCol,
                  offSetRow,
                  !isCapture
                ).forEach(item => {
                 // const enemyPiece = game.state.getPiece(newCol, newRow);
                  //if (!enemyPiece) {
                   // throw new Error({item})
                //  }
                 // if (enemyPiece) {
                    //console.log("Inimigo", newCol, newRow);
                    //console.log(enemyPiece);
                    // console.log(
                    //   `Peça ${col}-${row} => Há um inimigo em: x = ${newCol} - y = ${newRow}. Que pode ser capturado em: x = ${
                    //     newCol + offSetCol
                    //   } - y = ${newRow + offSetRow}`
                    // );
                    item.capturePiece.row = newRow
                    item.capturePiece.col = newCol
                    game.state.allPossibleMovesInTurn.push(item);
                    moves.push(item);
                  //}
                });
              } else {
                //console.log('Amigo')
              }
            }
          }

          return moves;
        }

        piece.possibleMovements = possibleMovements;
      }
    };
  }
  // Public interface of the factory
  return {
    createPiece: createPiece
  };
}
