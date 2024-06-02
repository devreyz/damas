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
          inAlert: this.piece.inAlert,
          moveDirection: this.piece.moveDirection
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

      // Função principal para mapear todos os movimentos possíveis de uma peça
      mapAllMoves(gameState, pieceCol, pieceRow, piece, config = {}) {
        // Desestruturação para obter o valor máximo de profundidade da configuração, padrão é 5
        const { maxDepth = 3 } = config;

        // Direções possíveis de movimento (diagonais)
        const directions = [
          { x: 1, y: 1 },
          { x: 1, y: -1 },
          { x: -1, y: 1 },
          { x: -1, y: -1 }
        ];

        // Desestruturação para obter se a peça é um rei e sua cor
        const { king, color, moveDirection } = piece;
        //console.log(piece)

        // Função para obter o estado de uma posição no tabuleiro
        const getPositionState = (
          matrix2D,
          row,
          col,
          direction,
          distance,
          capture = false
        ) => {
          const offsetRow = (capture ? 1 + distance : distance) * direction.y;
          const offsetCol = (capture ? 1 + distance : distance) * direction.x;

          const newRow = row + offsetRow;
          const newCol = col + offsetCol;

          // Verifica se a nova posição está fora dos limites do tabuleiro
          if (
            newRow < 0 ||
            newRow >= matrix2D.length ||
            newCol < 0 ||
            newCol >= matrix2D[0].length
          ) {
            //console.log({newCol,newRow})
            return -1;
          }

          // Retorna o estado da posição alvo
          return {
            target: matrix2D[newRow][newCol],
            position: { x: newCol, y: newRow }
          };
        };

        // Função para encontrar movimentos em todas as direções possíveis
        const findMovesInAllDirections = (
          matrix2D,
          initRow,
          initCol,
          isCapture,
          distance,
          depth,
          moveAttr
        ) => {
          // Verifica se a profundidade máxima foi atingida
          if (depth > maxDepth) return moveAttr;
          this.piece.possibleMovements = [];
          moveAttr = { ...moveAttr };
          const moves = [];

          directions.forEach(direction => {
            // Define a distância máxima com base se a peça é um rei ou não
            const maxDist = king ? gameState.length : 1;

            // Itera através das distâncias permitidas
            for (let index = 1; index <= maxDist; index++) {
              const statePosition = getPositionState(
                matrix2D,
                initRow,
                initCol,
                direction,
                index,
                false
              );

              // Se a posição é inválida ou contém uma peça da mesma cor, interrompe
              if (statePosition === -1 || color === statePosition.target) {
                //console.log({statePosition, color})
                break;
              } else {
                // Modelo de movimento inicial
                let move = {
                  initPos: { x: pieceCol, y: pieceRow },
                  targetPos: { x: null, y: null },
                  capturePos: { x: null, y: null },
                  isCapture: false,
                  isKing: king,
                  moveType: king ? "KING_MOVE" : "SIMPLE_MOVE",
                  nextMove: false,
                  attack: moveAttr.attack,
                  defense: moveAttr.defense,
                  sacrifice: moveAttr.sacrifice
                };

                // Se a posição contém uma peça do oponente
                if (
                  color !== statePosition.target &&
                  statePosition.target !== null
                ) {
                  const statePositionCapture = getPositionState(
                    matrix2D,
                    initRow,
                    initCol,
                    direction,
                    index,
                    true
                  );

                  // Se a posição após a captura está vazia, adiciona o movimento de captura
                  if (statePositionCapture.target === null) {
                    move.capturePos.x = statePosition.position.x;
                    move.capturePos.y = statePosition.position.y;
                    move.targetPos.x = statePositionCapture.position.x;
                    move.targetPos.y = statePositionCapture.position.y;
                    move.moveType = king ? "KING_CAPTURE" : "CAPTURE";
                    move.isCapture = true;
                    move.attack = 10;
                    move.defense = 1;
                    this.piece.possibleMovements.push(move);
                    game.state.allPossibleMovesInTurn.push(move)

                    moves.push(move);
                  }
                  break;
                } else if (statePosition.target === null) {
                  // Adiciona o movimento simples
                  move.targetPos.x = statePosition.position.x;
                  move.targetPos.y = statePosition.position.y;
                  move.attack = 1;
                  move.defense = 1;
                  if (moveDirection === direction.y || king) {
                    this.piece.possibleMovements.push(move);
                    game.state.allPossibleMovesInTurn.push(move)
                    moves.push(move);
                  }
                }
              }
            }
          });
          return moves;
        };

        // Função para encontrar todos os movimentos possíveis para a peça
        const findMoves = () => {
          const moveAttr = {
            attack: 1,
            defense: 1,
            sacrifice: false
          };
          //console.log(gameState)
          const moves = findMovesInAllDirections(
            gameState,
            pieceRow,
            pieceCol,
            false,
            1,
            1,
            moveAttr
          );
        };

        // Chama a função para encontrar e imprimir os movimentos possíveis
        findMoves();
      }
    };
  }
  // Public interface of the factory
  return {
    createPiece: createPiece
  };
}
