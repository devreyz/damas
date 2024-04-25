export function ToastComponent(data) {
  // Criar o elemento li
  this.element = document.createElement("li");
  this.element.className =
    "animate-swipUp absolute bottom-0 w-80 bg-white shadow-lg rounded-lg overflow-hidden border border-stone-900";
  this.closeToast = () => {
    this.element.classList.add("animate-swipRight");
    this.element.addEventListener("animationend", () => {
      this.element.remove();
    });
  };
  setTimeout(() => this.element.classList.remove("animate-swipUp"), 300);
  setTimeout(() => this.closeToast(), 5000);
  // Criar elementos internos
  this.header = document.createElement("div");
  this.header.className =
    "px-4 py-2 flex justify-between items-center border-b border-gray-200";
  this.title = document.createElement("h2");
  this.title.className = "text-lg text-stone-600 font-semibold";
  this.title.textContent = "Aceita o Desafio?";
  this.closeButton = document.createElement("button");
  this.closeButton.className =
    "text-gray-500 hover:text-gray-700 focus:outline-none";
  this.closeButton.innerHTML = `
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
    </svg>
  `;
  this.closeButton.onclick = () => {
    data.callback(false);
    this.closeToast();
  };
  this.body = document.createElement("div");
  this.body.className = "p-4";
  this.message = document.createElement("p");
  this.message.className = "text-sm text-gray-600";
  this.message.innerHTML = `<span class="font-semibold text-stone-950">${data.from}</span> te convidou para uma partida`;
  this.footer = document.createElement("div");
  this.footer.className = "px-4 py-2 gap-4 bg-stone-100 flex justify-end";
  this.acceptButton = document.createElement("button");

  this.acceptButton.className =
    "px-4 flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none";
  this.acceptButton.textContent = "Aceitar";
  this.acceptButton.onclick = () => {
    data.callback(true);
    this.closeToast();
  };

  this.declineButton = document.createElement("button");
  this.declineButton.className =
    "px-4 flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none";
  this.declineButton.textContent = "Recusar";
  this.declineButton.onclick = () => {
    data.callback(false);
    this.closeToast();
  };
  // Adicionar elementos internos ao header
  this.header.appendChild(this.title);
  this.header.appendChild(this.closeButton);

  // Adicionar elementos internos ao footer
  this.footer.appendChild(this.acceptButton);
  this.footer.appendChild(this.declineButton);

  // Adicionar elementos internos ao body
  this.body.appendChild(this.message);

  // Adicionar elementos internos ao elemento li
  this.element.appendChild(this.header);
  this.element.appendChild(this.body);
  this.element.appendChild(this.footer);
}
export function addToaster(data) {
  const toaster = document.getElementById("toaster");
  const items = toaster.querySelectorAll("li");
  items.forEach((elem) => {
    elem.classList.remove("animate-swipUp");
  });

  const li = new ToastComponent(data);

  // Obter o primeiro filho existente do elemento pai
  const firstChild = toaster.firstChild;

  // Inserir o novo elemento antes do primeiro filho existente
  toaster.insertBefore(li.element, firstChild);
}
