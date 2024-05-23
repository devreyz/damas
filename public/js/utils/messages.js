const messages = {
  invalidMove: [
    "Jogada inválida!",
    "Você não pode mover para lá.",
    "Essa jogada não é permitida.",
    "Tente novamente, essa jogada não é válida.",
    "Ops! Essa jogada não vai funcionar.",
    "Jogada inválida. Por favor, escolha outra.",
    "Desculpe, você não pode mover para lá.",
    "Essa jogada está fora dos limites.",
    "Você não pode ir para lá.",
    "Essa jogada não é permitida."
  ],
  validMove: [
    "Boa jogada!",
    "Muito bem!",
    "Bem jogado!",
    "Ótima escolha!",
    "Movimento inteligente!",
    "Você está melhorando!",
    "Continue assim!",
    "Essa foi uma jogada sólida.",
    "Jogada impressionante!",
    "Muito bem!"
  ],
  yourTurn: [
    "É a sua vez.",
    "Vá em frente, faça sua jogada.",
    "Sua vez de jogar.",
    "Hora de jogar.",
    "O que você vai fazer agora?",
    "Sua vez de brilhar!",
    "Faça um movimento.",
    "Sua vez, pense com cuidado.",
    "Vai em frente, é a sua vez.",
    "Hora de fazer sua jogada."
  ],
  aiTurn: [
    "A IA está pensando...",
    "Deixe-me ver...",
    "Vou fazer minha jogada agora.",
    "Minha vez.",
    "Hora de eu jogar.",
    "Assista a isso.",
    "Estou fazendo minha jogada.",
    "A IA está jogando.",
    "Vamos ver o que vou fazer.",
    "Aqui vai minha jogada."
  ],
  gameStart: [
    "Vamos começar o jogo!",
    "Jogo iniciado!",
    "Vamos começar!",
    "Pronto para jogar?",
    "Aqui vamos nós!",
    "Que comece o jogo!",
    "É hora do jogo!",
    "Prepare-se para jogar.",
    "Vamos começar.",
    "Pronto, vamos jogar!"
  ],
  gameEnd: [
    "Fim de jogo!",
    "Bem jogado!",
    "O jogo acabou.",
    "Bom jogo!",
    "Obrigado por jogar!",
    "Foi divertido!",
    "Jogo terminado.",
    "É o fim!",
    "Partida completa.",
    "Espero que tenha gostado do jogo!"
  ],
  piecePromotion: [
    "Peça promovida a dama!",
    "Parabéns, você tem uma dama!",
    "Muito bem, agora você tem uma dama!",
    "Sua peça agora é uma dama!",
    "Dama!",
    "Promoção para dama!",
    "Você acabou de promover uma peça para dama!",
    "Ótimo, você tem uma dama!",
    "Sua peça virou dama!",
    "Você ganhou uma dama!"
  ],
  captureMove: [
    "Peça capturada!",
    "Boa captura!",
    "Ótimo, você capturou uma peça!",
    "Muito bem, você capturou uma peça!",
    "Peça capturada!",
    "Você capturou uma peça do adversário!",
    "Bom, uma peça a menos!",
    "Boa captura!",
    "Você tirou uma peça!",
    "Captura bem-sucedida!"
  ],
  notYourTurn: [
    "Não é a sua vez.",
    "Espere sua vez.",
    "Por favor, espere, não é a sua vez.",
    "Aguarde, é a vez do oponente.",
    "Paciência, ainda não é a sua vez.",
    "Deixe o oponente jogar primeiro.",
    "Você tem que esperar sua vez.",
    "O oponente está jogando agora.",
    "Por favor, espere a jogada do oponente.",
    "Você não pode mover agora, é a vez do oponente."
  ],
  notYourPiece: [
    "Essa peça não é sua.",
    "Você não pode mover a peça do oponente.",
    "Selecione sua própria peça.",
    "Essa peça não é sua.",
    "Você só pode mover suas peças.",
    "Escolha uma peça da sua cor.",
    "Você não pode mover essa peça.",
    "Selecione uma peça sua.",
    "Essa peça não é sua para mover.",
    "Escolha sua própria peça."
  ]
};

// Função para obter uma mensagem aleatória de uma categoria
export function message(category) {
  const messagesArray = messages[category];
  return messagesArray[Math.floor(Math.random() * messagesArray.length)];
}
