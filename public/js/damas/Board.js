// Definindo as cores
const orangeLight = "#FFA500"; // Laranja claro
const white = "#FFFFFF"; // Branco
const brown = "#8B4513"; // Marrom
const gray = "#D3D3D3"; // Cinza
const orangeLighter = "#FFD700"; // Laranja mais claro
const whiteOff = "#FFFFF0"; // Branco off-white

// Tamanho do tabuleiro
let boardSize =
  window.innerWidth > window.innerHeight
    ? window.innerHeight
    : window.innerWidth;
let squareSize = boardSize / 10;

export class Board {
  constructor(state) {
    this.elem = document.createElement("div");
    this.resize();
    this.state = state
  }
  render() {
    
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

  resize() {
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
  }
}
