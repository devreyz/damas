// Função para mostrar notificação
export function showNotification(message) {
  const container = document.getElementById("notification-container");

  // Cria o elemento da notificação
  const notification = document.createElement("div");
  notification.className =
    "bg-red-400/80 backdrop-blur-md w-fit text-white px-4 py-1 rounded shadow-lg mb-4 transition-opacity duration-500";
  notification.innerText = message;

  // Adiciona a notificação ao container
const firstChild = container.firstChild;

// Inserir o novo elemento antes do primeiro filho existente
container.insertBefore(notification, firstChild);

  //container.appendChild(notification);

  // Remove a notificação após 2 segundos
  setTimeout(() => {
    notification.classList.add("opacity-0"); // Adiciona a classe para iniciar a transição de opacidade
    setTimeout(() => {
      notification.remove(); // Remove o elemento do DOM após a transição
    }, 500); // Tempo da transição
  }, 1500); // Tempo que a notificação fica visível
}
