// Função para mostrar notificação
export function showNotification(data) {
  const container = document.getElementById("notification-container");

  // Cria o elemento da notificação
  const notification = document.createElement("div");
  notification.className =
    `${data.color === "black" ? "bg-zinc-800/80": "bg-orange-800/80"} backdrop-blur-md w-fit text-white px-4 py-1 rounded shadow-lg mb-4 transition-opacity duration-500`;
  notification.innerText = data.msg;

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
  }, 500); // Tempo que a notificação fica visível
}
