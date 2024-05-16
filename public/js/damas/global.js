const username = document.cookie
  .split("; ")
  .find((row) => row.startsWith("username="))
  .split("=")[1];

const socketConfig = {
  auth: {
    username: username,
  },
};

const game = {};
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

let canvasSquare =
  window.innerWidth > window.innerHeight
    ? window.innerHeight
    : window.innerWidth;

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
