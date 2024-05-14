let render = ()=>{}
let canvasSquare = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth

// Estado inicial do jogo
let state = [
  [0, "b", 0, "b", 0, "b", 0, "b", 0, "b"],
  ["b", 0, "b", 0, "b", 0, "b", 0, "b", 0],
  [0, "b", 0, "b", 0, "b", 0, "b", 0, "b"],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["w", 0, "w", 0, "w", 0, "w", 0, "w", 0],
  [0, "w", 0, "w", 0, "w", 0, "w", 0, "w"],
  ["w", 0, "w", 0, "w", 0, "w", 0, "w", 0],
];
document.getElementById("teste").onclick = () => {
 state = [
  [0, "b", 0, "b", 0, "b", 0, "b", 0, "b"],
  ["b", 0, "b", 0, "b", 0, "b", 0, "b", 0],
  [0, "b", 0, "b", 0, "b", 0, "b", 0, "b"],
  [0, 0, 0, 'b', 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["w", 0, "w", 0, "w", 0, "w", 0, "w", 0],
  [0, "w", 0, "w", 0, "w", 0, "w", 0, "w"],
  ["w", 0, "w", 0, "w", 0, "w", 0, "w", 0],
];
}
function setup() {
  // put setup code here
  createCanvas(canvasSquare, canvasSquare)

}

let lastPos = {
  x: 0,
  y: 0,
};
function draw() {
  render()
}
