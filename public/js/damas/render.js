function setup() {
  // put setup code here
  createCanvas(canvasSquare, canvasSquare);
}

function draw() {
  background("#ffffff"); // Background marrom

  const gameState = game.state;

  // Desenhar quadrados do tabuleiro e peças
  gameState.getState().forEach((arr, row) => {
    arr.forEach((item, col) => {
      // Desenha o quadrado do tabuleiro
      if ((row + col) % 2 === 0) {
        fill(orangeLight); // Quadrados claros
      } else {
        fill(white); // Quadrados escuros
      }
      stroke("#000000")
      rect(col * squareSize, row * squareSize, squareSize, squareSize);

      // Desenha as peças
      if (item) {
        const piece = item;
        const { color, pos, isSelected } = piece.getInfo();

        if (color === "black") {
          fill(orangeLighter); // Peças laranjas
        } else if (color === "white") {
          fill(whiteOff); // Peças brancas
        }
        let x = col * squareSize + squareSize / 2;
        let y = row * squareSize + squareSize / 2;
          
        if (isSelected) {
          fill("#00ff00")
        }
        ellipse(x, y, squareSize * 0.8);
      }
    });
  });
}

//Mapa de cliques do tabuleiro
function mousePressed(event) {
  game.boardPressed({ mouseX, mouseY });
  event.preventDefault();
}

window.onresize = () => {
  const sizeScreen =
    window.innerWidth > window.innerHeight
      ? window.innerHeight
      : window.innerWidth;
  boardSize = sizeScreen;
  canvasSquare = sizeScreen;
  squareSize = boardSize / 10;
  setup();
};
