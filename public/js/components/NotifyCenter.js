// 1. Crie uma função que exiba uma mensagem na tela;
export function showNotify() {
  const app = document.body;
  const notify = `<div class="fixed bottom-10 left-1/2 -translate-x-1/2 bg-stone-800 text-white opacity-60 px-6 py-1 rounded-full">
    Este e um exemplo de notificação
  </div>`;

  app.appendChild(notify);
}

showNotify;