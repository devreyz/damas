// Estado inicial do jogo
let gameState = [
  [null, "b", null, "b", null, "b", null, "b", null, "b"],
  ["b", null, "b", null, "b", null, "b", null, "b", null],
  [null, "B", null, "b", null, "b", null, "b", null, "b"],
  [null, null, "w", null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  ["w", null, "w", null, "w", null, "w", null, "w", null],
  [null, "w", null, "w", null, "w", null, "w", null, "w"],
  ["w", null, "w", null, "w", null, "w", null, "w", null],
];

function findAllMovesFactory(config = {}) {
  // Definindo valores padrão usando operador `||`
  const maxDepth = config.maxDepth || 5;
  const directions = config.directions || [
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ];

  const findAllMoves = (state, initRow, initCol, piece) => {
    const { king } = piece;
    const moves = [];

    const getPositionState = (
      matrix2D,
      row,
      col,
      direction,
      capture = false
    ) => {
      const newRow = capture ? row + 2 * direction.y : row + direction.y;
      const newCol = capture ? col + 2 * direction.x : col + direction.x;

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

    const getMoves = () => {
      const { king, moveDirection } = piece;
      const moveModel = {
        initPos: { x: initCol, y: initRow },
        targetPos: { x: null, y: null },
        capturePos: { x: null, y: null },
        isCapture: false,
        isKing: king,
        moveType: king ? "KING_MOVE" : "SIMPLE_MOVE",
        depth: 0,
        nextMove: [],
        score: 0,
        attack: 0,
        defense: 0,
        sacrifice: false,
      };
      console.log(state);
      directions.forEach((direction) => {
        const saveMove = (moveObject) => {
          if (king || moveDirection === direction.y || moveObject.isCapture)
            moves.push(moveObject);
        };

        const findMove = (state, initRow, initCol, direction, depth) => {
          if (depth > maxDepth) return [];

          const move = { ...moveModel }; //Copia de moveModel
          const moves = [];
          const targetState = getPositionState(
            state,
            initRow,
            initCol,
            direction
          ); // Busca o estado da casa vazia: null ||  fora do tabuleiro: -1 || peca: peca:{pecaProps}

          // Adicione a lógica para verificar e construir movimentos aqui
          if (targetState.target === null) {
            move.targetPos = targetState.position;
            move.moveType = king ? "KING_MOVE" : "SIMPLE_MOVE";
            move.score = move.score + 1;
          } else if (targetState.target !== -1) {
            if (targetState.target === piece.color) {
              // console.log("amigo")
            } else {
              console.log("inimigo");
              const targetStateCapture = getPositionState(
                state,
                initRow,
                initCol,
                direction,
                true
              );

              if (
                targetState.target === -1 ||
                targetStateCapture.target === -1
              ) {
                return -1;
              }

              if (
                targetStateCapture.target === null &&
                targetStateCapture.target !== -1
              ) {
                move.capturePos = {
                  x: initCol + direction.x,
                  y: initRow + direction.y,
                };
                move.targetPos = targetStateCapture.position;
                move.isCapture = true;
                move.moveType = king ? "KING_CAPTURE_MOVE" : "CAPTURE_MOVE";
                move.score = move.score + 2;
              }
            }
          }
          saveMove(move);

          if (king) {
            findMove(
              state,
              move.targetPos.y,
              move.targetPos.x,
              direction,
              depth + 1
            );
          } else {
            moves.push(move);
          }
          return moves;
          //console.log(targetState)
        };

        if (king) {
          //console.log("king")
          const kingMove = findMove(state, initRow, initCol, direction, 1);
        } else {
          saveMove(findMove(state, initRow, initCol, direction, 1));
        }
      });
    };

    getMoves();
    return moves;
  };

  return {
    findAllMoves: findAllMoves,
  };
}

const findAllMovesInstance = findAllMovesFactory({ depth: 10 });

console.log(
  findAllMovesInstance.findAllMoves(gameState, 2, 1, {
    king: true,
    color: "b",
    moveDirection: 1,
  })
);
