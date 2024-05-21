function calcularMovimentosPossiveis(linha, coluna, corPeca, estadoDoJogo) {
  // Verifica se o turno é do jogador da peça
  if (estadoDoJogo.turno !== corPeca) {
    return []; // Retorna um array vazio se não for o turno da peça
  }

  // Inicializa o array de movimentos possíveis
  const movimentosPossiveis = [];

  // Calcula movimentos simples para cima (direção norte)
  movimentosPossiveis.push(
    ...calcularMovimentosSimples(linha, coluna, corPeca, estadoDoJogo, -1)
  );

  // Calcula movimentos simples para baixo (direção sul)
  movimentosPossiveis.push(
    ...calcularMovimentosSimples(linha, coluna, corPeca, estadoDoJogo, 1)
  );

  // Calcula movimentos de captura para cima (direção norte)
  movimentosPossiveis.push(
    ...calcularMovimentosCaptura(linha, coluna, corPeca, estadoDoJogo, -1)
  );

  // Calcula movimentos de captura para baixo (direção sul)
  movimentosPossiveis.push(
    ...calcularMovimentosCaptura(linha, coluna, corPeca, estadoDoJogo, 1)
  );

  // Retorna o array de movimentos possíveis
  return movimentosPossiveis;
}

// Função para calcular movimentos simples
function calcularMovimentosSimples(
  linha,
  coluna,
  corPeca,
  estadoDoJogo,
  direcao
) {
  const movimentosSimples = [];

  // Verifica se a peça pode mover na direção especificada
  const novaLinha = linha + direcao;
  const novaColuna = coluna;

  if (
    novaLinha >= 0 &&
    novaLinha < estadoDoJogo.tamanhoTabuleiro &&
    novaColuna >= 0 &&
    novaColuna < estadoDoJogo.tamanhoTabuleiro &&
    estadoDoJogo.pecas[novaLinha][novaColuna] === null
  ) {
    // Adiciona a nova posição como um movimento simples
    movimentosSimples.push({
      linha: novaLinha,
      coluna: novaColuna,
    });

    // Verifica se é possível continuar movendo na mesma direção (movimentos recursivos)
    movimentosSimples.push(
      ...calcularMovimentosSimples(
        novaLinha,
        novaColuna,
        corPeca,
        estadoDoJogo,
        direcao
      )
    );
  }

  return movimentosSimples;
}

// Função para calcular movimentos de captura
function calcularMovimentosCaptura(
  linha,
  coluna,
  corPeca,
  estadoDoJogo,
  direcao
) {
  const movimentosCaptura = [];

  // Verifica se a peça pode capturar na direção especificada
  const novaLinha = linha + 2 * direcao;
  const novaColuna = coluna + 1;

  if (
    novaLinha >= 0 &&
    novaLinha < estadoDoJogo.tamanhoTabuleiro &&
    novaColuna >= 0 &&
    novaColuna < estadoDoJogo.tamanhoTabuleiro &&
    estadoDoJogo.pecas[novaLinha][novaColuna] !== null &&
    estadoDoJogo.pecas[novaLinha][novaColuna].cor !== corPeca
  ) {
    // Adiciona a nova posição como um movimento de captura
    movimentosCaptura.push({
      linha: novaLinha,
      coluna: novaColuna,
    });

    // Verifica se é possível continuar capturando na mesma direção (movimentos recursivos)
    movimentosCaptura.push(
      ...calcularMovimentosCaptura(
        novaLinha,
        novaColuna,
        corPeca,
        estadoDoJogo,
        direcao
      )
    );
  }

  return movimentosCaptura;
}
