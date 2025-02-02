const username = document.cookie
  .split("; ")
  .find((row) => row.startsWith("username="))
  .split("=")[1];

const socketConfig = {
  auth: {
    username: username,
  },
};

// Obter a string de query (query string) da URL atual
const queryString = window.location.search;

// Criar um objeto URLSearchParams a partir da query string
const urlParams = new URLSearchParams(queryString);

// Obter o valor do parâmetro 'id'
const roomId = urlParams.get("id");

const game = {};
// Definindo as cores
const orangeLight = "#FFA500"; // Laranja claro
const white = "#FFFFFF"; // Branco
const brown = "#8B4513"; // Marrom
const gray = "#D3D3D3"; // Cinza
const orangeLighter = "#FFD700"; // Laranja mais claro
const dark = "#123400";
const light = "#d3d3d3";
const whiteOff = "#FFFFF0"; // Branco off-white
const kingDark = "#FFA555";

const boardContainer = document.getElementById("board-container");
const statusSection = document.getElementById("status-section");

let spaceY =
  window.innerWidth > window.innerHeight ? statusSection.clientHeight : 0;
  

// Tamanho do tabuleiro
let boardSize =
  window.innerWidth > window.innerHeight
    ? window.innerHeight
    : window.innerWidth;
boardSize -= spaceY;
let squareSize = boardSize / 10;

let canvasSquare = boardSize;
boardContainer.style.width = boardSize;
boardContainer.style.height = boardSize;

// Estado inicial do jogo
let gameState = [
  [null, "b", null, "b", null, "b", null, "b", null, "b"],
  ["b", null, "b", null, "b", null, "b", null, "b", null],
  [null, "b", null, "b", null, "b", null, "b", null, "b"],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  ["w", null, "w", null, "w", null, "w", null, "w", null],
  [null, "w", null, "w", null, "w", null, "w", null, "w"],
  ["w", null, "w", null, "w", null, "w", null, "w", null],
];
