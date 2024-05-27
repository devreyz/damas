class Damas {
  // Construtor da classe Damas
  constructor(tabuleiro, linha, coluna, isKing = false) {
    this.tabuleiro = tabuleiro; // Tabuleiro do jogo
    this.linha = linha; // Linha da peça no tabuleiro
    this.coluna = coluna; // Coluna da peça no tabuleiro
    this.isKing = isKing; // Indica se a peça é uma "dama" (rei)
    this.movimentosPossiveis = []; // Array para armazenar os movimentos possíveis
    this.maxDepth = 5; // Limite de profundidade da busca em profundidade
  }

  // Calcula a pontuação de um movimento
  calcularPontuacao(movimento) {
    let pontuacao = movimento.isCapture ? 2 : 1; // 2 pontos para captura, 1 ponto para movimento simples
    let depth = 0;

    // Função recursiva para calcular a pontuação dos movimentos subsequentes
    const calcularPontuacaoRecursiva = (movimentos) => {
      if (movimentos.nextMove && movimentos.nextMove.length > 0) {
        depth += 1; // Incrementa a profundidade
        movimentos.nextMove.forEach((m) => {
          pontuacao += this.calcularPontuacao(m); // Adiciona a pontuação do movimento subsequente
        });
      }
    };

    calcularPontuacaoRecursiva(movimento);
    return pontuacao + depth; // Retorna a pontuação total incluindo a profundidade
  }

  // Busca em profundidade para encontrar movimentos possíveis
  movimentosDFS(linha, coluna, depth, isKing, visitados) {
    if (depth > this.maxDepth) return []; // Limita a profundidade da busca

    // Definição das direções de movimento
    const direcoes = isKing
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] // Movimentos de um rei (em todas as diagonais)
      : [[1, -1], [1, 1]]; // Movimentos de uma peça normal (para baixo)

    let movimentos = [];

    for (const direcao of direcoes) {
      const novaLinha = linha + direcao[0];
      const novaColuna = coluna + direcao[1];

      // Verifica se a nova posição está dentro dos limites do tabuleiro e não foi visitada
      if (
        novaLinha >= 0 && novaLinha < this.tabuleiro.length &&
        novaColuna >= 0 && novaColuna < this.tabuleiro[0].length
      ) {
        if (this.tabuleiro[novaLinha][novaColuna] === 0 && !visitados[novaLinha][novaColuna]) {
          visitados[novaLinha][novaColuna] = true; // Marca a posição como visitada
          const move = {
            initPos: { x: linha, y: coluna },
            targetPos: { x: novaLinha, y: novaColuna },
            capturePos: { x: null, y: null },
            isCapture: false,
            isKing: isKing,
            moveType: isKing ? "KING_MOVE" : "SIMPLE_MOVE",
            depth: depth,
            nextMove: [],
            score: 0
          };
          // Busca recursiva para movimentos subsequentes
          move.nextMove = this.movimentosDFS(novaLinha, novaColuna, depth + 1, isKing, this.cloneVisitados(visitados));
          move.score = this.calcularPontuacao(move); // Calcula a pontuação do movimento
          movimentos.push(move);
        }
      }

      // Verifica a possibilidade de captura
      const capturarLinha = linha + 2 * direcao[0];
      const capturarColuna = coluna + 2 * direcao[1];
      if (
        capturarLinha >= 0 && capturarLinha < this.tabuleiro.length &&
        capturarColuna >= 0 && capturarColuna < this.tabuleiro[0].length
      ) {
        const midLinha = linha + direcao[0];
        const midColuna = coluna + direcao[1];
        if (
          this.tabuleiro[midLinha][midColuna] === 1 && this.tabuleiro[capturarLinha][capturarColuna] === 0 &&
          !visitados[capturarLinha][capturarColuna]
        ) {
          visitados[capturarLinha][capturarColuna] = true; // Marca a posição de captura como visitada
          const move = {
            initPos: { x: linha, y: coluna },
            targetPos: { x: capturarLinha, y: capturarColuna },
            capturePos: { x: midLinha, y: midColuna },
            isCapture: true,
            isKing: isKing,
            moveType: isKing ? "KING_CAPTURE_MOVE" : "CAPTURE_MOVE",
            depth: depth,
            nextMove: [],
            score: 0
          };
          // Busca recursiva para movimentos subsequentes após a captura
          move.nextMove = this.movimentosDFS(capturarLinha, capturarColuna, depth + 1, isKing, this.cloneVisitados(visitados));
          move.score = this.calcularPontuacao(move); // Calcula a pontuação do movimento
          movimentos.push(move);
        }
      }
    }
    return movimentos; // Retorna os movimentos possíveis
  }

  // Clona a matriz de visitados
  cloneVisitados(visitados) {
    return visitados.map(row => row.slice());
  }

  // Encontra todos os movimentos possíveis a partir da posição atual da peça
  encontrarMovimentos() {
    this.movimentosPossiveis = []; // Reseta a lista de movimentos possíveis
    const visitados = Array(this.tabuleiro.length).fill(null).map(() => Array(this.tabuleiro[0].length).fill(false));
    visitados[this.linha][this.coluna] = true; // Marca a posição inicial como visitada
    this.movimentosPossiveis = this.movimentosDFS(this.linha, this.coluna, 1, this.isKing, visitados); // Inicia a busca
    return this.movimentosPossiveis;
  }
}

// Exemplo de uso:
// 0 = casa vazia, 1 = peça (pode ser ajustado para representar diferentes peças)
const tabuleiro = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1]
];

// Inicializa uma peça na posição (2, 2)
const damas = new Damas(tabuleiro, 2, 2);
const movimentos = damas.encontrarMovimentos();
//console.log("Movimentos possíveis:", JSON.stringify(movimentos, null, 2));
console.log(gameState)