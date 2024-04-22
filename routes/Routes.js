import JsonWebToken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const jwt = JsonWebToken;
export class Routes {
  constructor(app, conn) {
    this.app = app;
    this.conn = conn;

    this.initialize();
  }
  initialize() {
    this.setRoutes();
  }
  setRoutes() {
    this.app.get("/", (req, res) =>
      res.sendFile(__dirname + "/public/index.html")
    );
    this.app.get("/game/home", this.validtoken, (req, res) => {
      res.sendFile(__dirname + "/public/game.html");
    });
    this.app.post("/auth/register", async (req, res) => {
      const { name, password } = req.body;

      // Validação dos dados de entrada
      if (!name) {
        return res.status(400).send("O nome é obrigatório");
      }
      if (!password) {
        return res.status(400).send("A senha é obrigatória");
      }

      await this.conn.query(
        "INSERT INTO users (name, pass) VALUES (?, ?)",
        [name, password],
        (error, results) => {
          if (error) {
            console.error("Erro ao salvar dados no banco de dados:", error);
            res.status(500).send("Erro ao salvar dados no banco de dados");
            return;
          }
          console.log("Dados salvos no banco de dados com sucesso");
          res.send("Dados recebidos e salvos com sucesso!");
        }
      );
    });

    // Rota para fazer login
    this.app.post("/auth/login", async (req, res) => {
      const { name, password } = req.body;
      // Validação dos dados de entrada
      if (!name) {
        return res.status(400).send("O nome é obrigatório");
      }
      if (!password) {
        return res.status(400).send("A senha é obrigatória");
      }

      // Consulta ao banco de dados para encontrar o usuário com as credenciais fornecidas
      this.conn.query(
        "SELECT * FROM users WHERE name = ? AND pass = ?",
        [name, password],
        (error, results) => {
          if (error) {
            console.error("Erro ao consultar o banco de dados:", error);
            res.status(500).send("Erro ao consultar o banco de dados");
            return;
          }

          // Verifica se o usuário foi encontrado
          if (results.length === 0) {
            // Se não houver usuário com essas credenciais, envie uma mensagem de erro
            console.log("Usuário não encontrado");
            res.status(401).send("Credenciais inválidas");
            return;
          }

          // Se as credenciais estiverem corretas, envie uma mensagem de sucesso

          // Cria um token JWT com o nome do usuário
          const { id, name } = results[0];
          const token = jwt.sign({ id, name }, process.env.SECRET, {
            expiresIn: "600s",
          });
          res.clearCookie("token");
          res.cookie("token", token, { httpOnly: true });
          res.redirect(
            // res.status(200).send("Login efetuado com sucesso");
            "/game/home"
          );
        }
      );
    });

    this.app // Middleware para lidar com rotas não encontradas
      .use((req, res, next) => {
        res.status(404).sendFile(__dirname + "/public/not-found.html");
      });
  }
  validtoken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send("Faça login");
      // return res.redirect("http://localhost:3000/");
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send("Sessão expirada faça login novamente");
        // return res.redirect("http://localhost:3000/");
      }
      req.user = decoded; // Adiciona o usuário decodificado ao objeto de solicitação

      next(); // Continua para a próxima middleware ou rota
    });
  }
}
