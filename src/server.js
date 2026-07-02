require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require('bcryptjs');

// Rotas
const apiRoutes = require("./routes/apiRoutes");
const authRoutes = require("./routes/authRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// arquivos estáticos (CSS)
app.use(express.static(path.join(__dirname, "../public")));

// ROTA PÚBLICA DE VERSÃO
app.use("/api", apiRoutes);

// ROTAS DE AUTENTICAÇÃO (públicas)
app.use("/api/auth", authRoutes);

// ROTAS PROTEGIDAS (todas usam authMiddleware)
app.use("/api/categorias", categoriaRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/pedidos", pedidoRoutes);

// Rotas das views (frontend)
app.get("/", (req, res) => {
    res.redirect("/login");
});

// LOGIN (view)
app.get("/login", (req, res) => {
    res.render("login", { erro: null });
});

app.post("/login", async (req, res) => {
    try {
        const { nick, senha } = req.body;
        const db = require('./config/database');

        const [rows] = await db.query('SELECT * FROM usuarios WHERE nick = ?', [nick]);
        const usuario = rows[0];

        if (!usuario) {
            return res.render("login", { erro: "Usuário não encontrado." });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.render("login", { erro: "Senha incorreta." });
        }

        res.redirect("/produtos");
    } catch (error) {
        console.error('Erro no login:', error);
        res.render("login", { erro: "Erro ao fazer login." });
    }
});

// REGISTER (view)
app.get("/register", (req, res) => {
    res.render("register", { erro: null });
});

app.post("/register", async (req, res) => {
    try {
        const { nome, nick, senha } = req.body;
        const db = require('./config/database');

        if (!nome || !nick || !senha) {
            return res.render("register", { erro: "Preencha todos os campos." });
        }

        // Verifica se usuário já existe
        const [existing] = await db.query('SELECT * FROM usuarios WHERE nick = ?', [nick]);
        if (existing.length > 0) {
            return res.render("register", { erro: "Nick já cadastrado." });
        }

        // Criptografa a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Insere no banco
        await db.query(
            'INSERT INTO usuarios (nome, nick, senha) VALUES (?, ?, ?)',
            [nome, nick, senhaCriptografada]
        );

        // Redireciona para o login
        res.redirect("/login");
    } catch (error) {
        console.error('Erro no registro:', error);
        res.render("register", { erro: "Erro ao cadastrar usuário." });
    }
});

// LISTAR PRODUTOS (view)
app.get("/produtos", async (req, res) => {
    const ProdutoModel = require('./models/produtoModel');
    const produtos = await ProdutoModel.findAll();
    res.render("produtos", { produtos });
});

// NOVO PRODUTO (view)
app.get("/produtos/novo", (req, res) => {
    res.render("novoProduto");
});

app.post("/produtos", async (req, res) => {
    const ProdutoModel = require('./models/produtoModel');
    const { nome, descricao, preco, categoria, estoque } = req.body;
    try {
        await ProdutoModel.create({
            nome,
            valor: preco,
            estoque: estoque || 1,
            categorias_id_categoria: 1
        });
        res.redirect("/produtos");
    } catch (error) {
        res.redirect("/produtos");
    }
});

// EDITAR PRODUTO (view)
app.get("/produtos/editar/:id", async (req, res) => {
    const ProdutoModel = require('./models/produtoModel');
    const produto = await ProdutoModel.findById(req.params.id);
    res.render("editarProduto", { produto });
});

app.post("/produtos/editar/:id", async (req, res) => {
    const ProdutoModel = require('./models/produtoModel');
    const { nome, descricao, preco, categoria, estoque } = req.body;
    try {
        await ProdutoModel.update(req.params.id, {
            nome,
            valor: preco,
            estoque: estoque || 1
        });
        res.redirect("/produtos");
    } catch (error) {
        res.redirect("/produtos");
    }
});

// DELETAR PRODUTO (view)
app.post("/produtos/deletar/:id", async (req, res) => {
    const ProdutoModel = require('./models/produtoModel');
    await ProdutoModel.delete(req.params.id);
    res.redirect("/produtos");
});

// servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`API Versão: ${process.env.API_VERSION || '2.0.0'}`);
    console.log(`Status: online`);
});