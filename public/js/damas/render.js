function preload() {
  imgKing = loadImage("/assets/img/coroa.png");
}
function setup() {
  // put setup code here
  canvas = createCanvas(canvasSquare, canvasSquare);
  canvas.parent("board-container");
  document.body.style.height = window.innerHeight + "px"
}


function draw() {
  if (game.state) {
    background("#ffffff"); // Background marrom

    const gameState = game.state;

    // Desenhar quadrados do tabuleiro e peças
    gameState.getState().forEach((arr, row) => {
      arr.forEach((item, col) => {
        // Desenha o quadrado do tabuleiro
        if ((row + col) % 2 === 0) {
          fill(light); // Quadrados escuros
        } else {
          fill(dark); // Quadrados claros
        }
        stroke("#000000");

        rect(col * squareSize, row * squareSize, squareSize, squareSize);

        // Desenha as peças
        if (item) {
          const piece = item;
          const { color, king, position, isSelected } = piece.getInfo();

          if (color === "black") {
            fill(orangeLighter); // Peças laranjas
          } else if (color === "white") {
            fill(whiteOff); // Peças brancas
          }
          let x = col * squareSize + squareSize / 2;
          let y = row * squareSize + squareSize / 2;

          if (isSelected) fill("#00ff00");

          ellipse(x, y, squareSize * 0.8);
          if (king) {
            image(
              imgKing,
              x - squareSize / 4,
              y - squareSize / 4,
              squareSize / 2,
              squareSize / 2
            );
          }
        }
      });
    });
  }
}

//Mapa de cliques do tabuleiro
function mousePressed(event) {
  if (event.target === canvas.elt) {
    let col = floor(mouseX / squareSize);
    let row = floor(mouseY / squareSize);

    const data = {
      room: roomId,
      state: gameState,
      position: { col, row },
      player: {
        color: game.state.playerColor,
      },
    };
    game.boardPressed(data, false);
    event.preventDefault();
  }
}

window.onresize = () => {
  document.body.style.height = window.innerHeight + "px"

  boardSize -= spaceY;

  const sizeScreen =
    window.innerWidth > window.innerHeight
      ? window.innerHeight
      : window.innerWidth;
  spaceY =
    window.innerWidth > window.innerHeight ? statusSection.clientHeight : 0;
  boardSize = sizeScreen - spaceY;

  canvasSquare = boardSize;
  boardContainer.style.width = boardSize;
  boardContainer.style.height = boardSize;
  squareSize = boardSize / 10;
  setup();
};
