// CheckersPiece Factory Function
export function PieceFactory() {
  // Function to create a new piece
  function createPiece(color, row, column) {
    return {
      piece: {
        color: color, // 'white' or 'black'
        king: false, // if it is a king piece or not
        position: {
          row: row,
          column: column,
        },
        // Other attributes can be added as needed
      },

      // Method to move the piece
      move(newRow, newColumn) {
        this.piece.position.row = newRow;
        this.piece.position.column = newColumn;
      },

      // Method to promote the piece to king
      promote() {
        this.piece.king = true;
      },

      // Method to get piece information
      getInfo() {
        return {
          color: this.piece.color,
          king: this.piece.king,
          position: this.piece.position,
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

      // Method to set the position of the piece
      setPosition(row, column) {
        this.piece.position.row = row;
        this.piece.position.column = column;
      },
    };
  }

  // Public interface of the factory
  return {
    createPiece: createPiece,
  };
}

