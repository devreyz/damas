let imgKing;
let posAtual;
let posAlvo;
let velocidade = 2; // Velocidade de movimento constante

function preload() {
  imgKing = loadImage("/assets/img/coroa.png");
}
function setup() {
  // put setup code here
  canvas = createCanvas(canvasSquare, canvasSquare);
  posAtual = createVector(10, 10);
  posAlvo = createVector(50, 50);
}

function draw() {
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
        // if (position.row !== item.piece.lastPosition.row) {
        //   // Calcular a direção da transição
        //   let direcao = p5.Vector.sub(posAlvo, posAtual).normalize();

        //   // Multiplicar a direção pela velocidade para obter o deslocamento
        //   let deslocamento = direcao.mult(velocidade);

        //   // Atualizar a posição atual com o deslocamento
        //   posAtual.add(deslocamento);

        //   // Desenhar um círculo na posição atual
        //   ellipse(posAtual.x, posAtual.y, 20, 20);
        // }

        if (color === "black") {
          fill(orangeLighter); // Peças laranjas
        } else if (color === "white") {
        fill(whiteOff); // Peças brancas
        }
        let x = col * squareSize + squareSize / 2;
        let y = row * squareSize + squareSize / 2;

        //if (king) fill(kingDark);
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

        // fill("#ffddff");
        // textSize(14);
        // text(
        //   `x: ${position.column} - y ${position.row}`,
        //   col * squareSize + 5,
        //   row * squareSize + squareSize / 2
        // );
      }
    });
  });
}

//Mapa de cliques do tabuleiro
function mousePressed(event) {
  game.boardPressed({ mouseX, mouseY });
  if (event.target === canvas.elt) {
    event.preventDefault();
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
