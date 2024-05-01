import EventEmitter from "../utils/EventEmitter.js";
function JoinRequestNotification(callback) {
  const toastElem = document.createElement("li");
  const timeRemoveClass = setTimeout(
    () => toastElem.classList.remove("animate-swipUp"),
    300
  );
  const timeCloseToast = setTimeout(() => closeToast(), 5000);

  const closeToast = () => {
    clearTimeout(timeRemoveClass);
    clearTimeout(timeCloseToast);
    toastElem.classList.add("animate-swipRight");
    toastElem.addEventListener("animationend", () => {
      toastElem.remove();
    });
  };
  toastElem.className =
    "animate-swipUp absolute bottom-0 w-80 bg-white shadow-lg rounded-lg overflow-hidden border border-stone-900";
  toastElem.innerHTML = `
    <div class="px-4 py-2 flex justify-between items-center border-b border-gray-200">
      <h2 class="text-lg text-stone-600 font-semibold">Aceita o Desafio?</h2>
      <button
        class="closeButton text-gray-500 hover:text-gray-700 focus:outline-none">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z"
            clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
    <div class="p-4">
      <p class="text-sm text-gray-600"><span class="font-semibold text-stone-950">player1</span> te convidou para uma
        partida</p>
    </div>
    <div class="px-4 py-2 gap-4 bg-stone-100 flex justify-end"><button
        class="acceptButton px-4 flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none">Aceitar</button><button
        class="declineButton px-4 flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">Recusar</button>
    </div>`;

  const closeButton = toastElem.querySelector(".closeButton");
  const acceptButton = toastElem.querySelector(".acceptButton");
  const declineButton = toastElem.querySelector(".declineButton");

  closeButton.onclick = () => {
    callback(false)
    EventEmitter.emit("JoinRequestNotification", { msg: "Rejeitado" });
    closeToast();
  };
  acceptButton.onclick = () => {
    callback(true);

    EventEmitter.emit("JoinRequestNotification", { msg: "Aceito" });
    closeToast();
  };
  declineButton.onclick = () => {
    callback(false);

    EventEmitter.emit("JoinRequestNotification", { msg: "Rejeitado" });
    closeToast();
  };

  return toastElem;
}

export function addToaster(data, callback) {
  const toaster = document.getElementById("toaster");
  const items = toaster.querySelectorAll(".animate-swipUp");
  items.forEach((elem) => {
    elem.classList.remove("animate-swipUp");
  });

  const li = JoinRequestNotification(callback);

  // Obter o primeiro filho existente do elemento pai
  const firstChild = toaster.firstChild;

  // Inserir o novo elemento antes do primeiro filho existente
  toaster.insertBefore(li, firstChild);
}
EventEmitter.on("addtoast", (data, callback) => addToaster(data, callback))
