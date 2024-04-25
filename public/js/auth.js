class Auth {
  constructor(form) {
    this.form = document.getElementById(form);
  }
  initialize() {
    this.form.onsubmit = event => {
      event.preventDefault();
      
    
      // Captura os dados do formulário
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Determina a ação com base no botão clicado
      const action = event.submitter.dataset.action;
      
      // URL da API com base na ação
      let url = "";
      if (action === "login") {
        url = "/auth/login";
      } else if (action === "register") {
        url = "/auth/register";
      }

      const formData = new URLSearchParams();
      formData.append("name", username);
      formData.append("password", password);

      // Opções para a requisição Fetch
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString() // Converte os dados para uma string no formato correto
      };

      // Requisição Fetch para a API
      fetch(url, options)
        .then(response => {
          
        if(response.redirected)window.location.href = response.url;
        return response.json()})
        .then(data => {
          // Lida com a resposta da API
          this.showMessage(data)
        })
        .catch(error => {
          console.error("Erro:", error);
        });
    };
  }
  login() {}
  showMessage(data){
    const container = document.getElementById("msg-server")
    container.classList = data.status
    container.innerHTML = data.msg
  }
  enableInput(){
    
  }
}

new Auth("auth-form").initialize();