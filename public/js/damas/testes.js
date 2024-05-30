// Estado inicial do jogo
function mapAllMove(gameState, pieceCol, pieceRow, piece, config = {}) {
  // Definindo valores padrão usando operador `||`
  const maxDepth = config.maxDepth || 5;
  const directions = [
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ];

  const { king, color } = piece;

  const moveModel = {
    initPos: { x: pieceCol, y: pieceRow },
    targetPos: { x: null, y: null },
    capturePos: { x: null, y: null },
    isCapture: false,
    isKing: king,
    moveType: king ? "KING_MOVE" : "SIMPLE_MOVE",
    nextMove: false,
    attack: 0,
    defense: 0,
    sacrifice: false,
  };

  const getPositionState = (
    matrix2D,
    row,
    col,
    direction,
    distance,
    capture = false
  ) => {
    const offSetRow = capture
      ? (1 + distance) * direction.y
      : distance * direction.y;
    const offSetCol = capture
      ? (1 + distance) * direction.x
      : distance * direction.x;

    const newRow = row + offSetRow;
    const newCol = col + offSetCol;

    // console.table({offSetRow, offSetCol});

    if (
      newRow < 0 ||
      newRow >= matrix2D.length ||
      newCol < 0 ||
      newCol >= matrix2D[0].length
    ) {
      return -1;
    }
    return {
      target: matrix2D[newRow][newCol],
      position: {
        x: newCol,
        y: newRow,
      },
    };
  };

  const fidInAllDirection = (
    matrix2D,
    initRow,
    initCol,
    isCapture,
    distance,
    depth
  ) => {
    if (depth > maxDepth) return "Fim";
    const moves = [];
    directions.forEach((direction) => {
      if (king) {
        for (let index = 1; index < gameState.length; index++) {
          const statePosition = getPositionState(
            matrix2D,
            initRow,
            initCol,
            direction,
            index,
            false
          );
          if (statePosition === -1 || color === statePosition.target) {
            break;
          } else {
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
              if (statePositionCapture.target === null) {
                moves.push(statePosition);
              }
              break;
            } else {
              moves.push(statePosition);
            }
          }
        }
      } else {
        const statePosition = getPositionState(
          matrix2D,
          initRow,
          initCol,
          direction,
          1,
          false
        );
        if (statePosition === -1 || color === statePosition.target) {
        } else {
          if (color !== statePosition.target && statePosition.target !== null) {
            const statePositionCapture = getPositionState(
              matrix2D,
              initRow,
              initCol,
              direction,
              1,
              true
            );
            if (statePositionCapture.target === null) {
              moves.push(statePosition);
            }
          } else {
            moves.push(statePosition);
          }
        }
      }
    });
    // console.log(moves);
    return moves;
  };

  const saveMove = () => {
    if (king || moveDirection === direction.y || moveObject.isCapture)
      moves.push(moveObject);
  };

  const findMoves = () => {
    const moves = fidInAllDirection(gameState, pieceRow, pieceCol, false, 1, 1);
    console.log(moves);
  };

  findMoves();
}

let gameState = [
  [null, "b", null, "b", null, "b", null, "b", null, "b"],
  ["b", null, "b", null, "b", null, "b", null, "b", null],
  [null, "b", null, "b", null, "b", null, "b", null, "b"],
  [null, null, "w", null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  ["w", null, "w", null, "w", null, "w", null, "w", null],
  [null, "w", null, "w", null, "w", null, "w", null, "w"],
  ["w", null, "w", null, "w", null, "w", null, "w", null],
];

mapAllMove(gameState, 1, 2, { color: "b", king: false });
