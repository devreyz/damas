export function startCountdown(duration, link) {
  // Cria um novo elemento div para a contagem regressiva
  const countdownContainer = document.createElement("div");
  countdownContainer.className =
    "countdown-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-300 rounded-lg p-6 text-center shadow-lg";
  countdownContainer.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Aguardando início da partida...</h2>
        <div id="countdown" class="text-4xl font-bold text-red-500">00:00:000</div>
    `;

  // Adiciona o elemento ao body do documento
  document.body.appendChild(countdownContainer);

  // Função para atualizar a contagem regressiva a cada 100ms
  const intervalId = setInterval(() => {
    duration -= 100; // Reduz o tempo restante em 100ms

    // Verifica se o tempo acabou
    if (duration <= 0) {
      clearInterval(intervalId); // Para o intervalo
      window.location.href =  link
      document.body.removeChild(countdownContainer); // Remove o elemento da contagem regressiva
    } else {
      // Calcula os minutos, segundos e milissegundos restantes
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((duration % (1000 * 60)) / 1000);
      const milliseconds = duration % 1000;

      // Atualiza o elemento HTML com a contagem regressiva
      document.getElementById("countdown").textContent = `${
        seconds < 10 ? "0" : ""
      }${seconds}:${String(milliseconds)[0]}`;
    }
  }, 100);
}
