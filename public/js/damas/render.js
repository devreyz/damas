

function setup() {
  // put setup code here
  createCanvas(canvasSquare, canvasSquare);
}


function draw() {
  background(brown); // Background marrom
  // Desenhar quadrados do tabuleiro e peças
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      // Desenha o quadrado do tabuleiro
      if ((row + col) % 2 === 0) {
        fill(orangeLight); // Quadrados claros
      } else {
        fill(white); // Quadrados escuros
      }
      rect(col * squareSize, row * squareSize, squareSize, squareSize);

      // Desenha as peças
      let piece = state[row][col];
      if (piece === "b") {
        fill(orangeLighter); // Peças laranjas
      } else if (piece === "w") {
        fill(whiteOff); // Peças brancas
      }
      if (piece !== 0) {
        let x = col * squareSize + squareSize / 2;
        let y = row * squareSize + squareSize / 2;
        ellipse(x, y, squareSize * 0.8);
      }
    }
  }
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
