import JsonWebToken from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import { diskStorage } from "multer";

// Configuração do multer para salvar os arquivos no diretório 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/assets/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

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
    this.app.get("/", this.validtoken, (req, res) => {
      res.sendFile(__dirname + "/public/index.html");
    });
    
    this.app.get("/admin", this.validtoken, (req, res) => {
      res.sendFile(__dirname + "/public/admin.html");
    });
    this.app.get("/home", this.validtoken, (req, res) => {
      res.sendFile(__dirname + "/public/home.html");
    });
    this.app.get("/game", this.validtoken, (req, res) => {
      res.sendFile(__dirname + "/public/game.html");
    });

    this.app.post("/auth/register", async (req, res) => {
      const { name, password } = req.body;

      // Validação dos dados de entrada
      if (!name) {
        return res.status(400).json({
          status: "alert",
          msg: "<i class='fi fi-br-exclamation'></i> O nome e Obrigatório!",
        });
      }
      if (!password) {
        return res.status(400).json({
          status: "alert",
          msg: "<i class='fi fi-br-exclamation'></i> A senha e Obrigatória!",
        });
      }

      await this.conn.query(
        "INSERT INTO users (name, pass) VALUES (?, ?)",
        [name, password],
        (error, results) => {
          if (error) {
            if ((error.code = "ER_DUP_ENTRY")) {
              res.status(500).json({
                status: "error",
                msg: "<i class='fi fi-br-times-hexagon'></i> Nome indisponível!",
              });
            } else {
              res.status(500).json({
                status: "error",
                msg: "<i class='fi fi-br-times-hexagon'></i> Houve um erro no servidor, tente novamente mais tarde!",
              });
            }
            return;
          }

          res.status(201).json({
            status: "success",
            msg: "<i class='fi fi-br-comment-check'></i>Conta criada com sucesso!",
          });
        }
      );
    });

    // Rota para fazer login
    this.app.post("/auth/login", async (req, res) => {
      const { name, password } = req.body;
      // Validação dos dados de entrada
      if (!name) {
        return res.status(201).json({
          status: "alert",
          msg: "<i class='fi fi-br-exclamation'></i> O nome é Obrigatório!",
        });
      }
      if (!password) {
        return res.status(201).json({
          status: "alert",
          msg: "<i class='fi fi-br-exclamation'></i> A senha é Obrigatória!",
        });
      }

      // Consulta ao banco de dados para encontrar o usuário com as credenciais fornecidas
      this.conn.query(
        "SELECT * FROM users WHERE name = ? AND pass = ?",
        [name, password],
        (error, results) => {
          if (error) {
            res.status(500).json({
              status: "error",
              msg: "<i class='fi fi-br-times-hexagon'></i> Houve um erro no servidor!",
            });
            return;
          }

          // Verifica se o usuário foi encontrado
          if (results.length === 0) {
            // Se não houver usuário com essas credenciais, envie uma mensagem de erro
            res.status(401).json({
              status: "alert",
              msg: "<i class='fi fi-br-exclamation'></i> Usuário não encontrado!",
            });
            return;
          }

          // Se as credenciais estiverem corretas, envie uma mensagem de sucesso

          // Cria um token JWT com o nome do usuário
          const { id, name } = results[0];
          const token = jwt.sign({ id, name }, process.env.SECRET, {
            expiresIn: process.env.EXPIRE_TOKEN,
          });
          res.clearCookie("token");
          res.clearCookie("username");
          res.cookie("username", name);
          res.cookie("token", token, { httpOnly: true });
          res.redirect("/home");
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
      //return res.status(401).send("Faça login");
      return res.redirect("/");
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        // return res.status(401).send("Sessão expirada faça login novamente");
        return res.redirect("/");
      }
      req.user = decoded; // Adiciona o usuário decodificado ao objeto de solicitação

      next(); // Continua para a próxima middleware ou rota
    });
  }
}
