const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

async function register(req, res) {
    try {
        const { nome, nick, senha } = req.body;

        if (!nome || !nick || !senha) {
            return res.status(400).json({ mensagem: "Preencha todos os campos." });
        }

        const [existing] = await db.query('SELECT * FROM usuarios WHERE nick = ?', [nick]);
        if (existing.length > 0) {
            return res.status(400).json({ mensagem: "Nick já cadastrado." });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const [result] = await db.query(
            'INSERT INTO usuarios (nome, nick, senha) VALUES (?, ?, ?)',
            [nome, nick, senhaCriptografada]
        );

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso.",
            usuario: { id: result.insertId, nome, nick }
        });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao registrar usuário." });
    }
}

async function login(req, res) {
    try {
        const { nick, senha } = req.body;

        if (!nick || !senha) {
            return res.status(400).json({ mensagem: "Informe nick e senha." });
        }

        const [rows] = await db.query('SELECT * FROM usuarios WHERE nick = ?', [nick]);
        const usuario = rows[0];

        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "Senha incorreta." });
        }

        const token = jwt.sign(
            { id: usuario.id_usuario, nick: usuario.nick },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            mensagem: "Login realizado com sucesso.",
            token,
            usuario: {
                id: usuario.id_usuario,
                nome: usuario.nome,
                nick: usuario.nick
            }
        });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao fazer login." });
    }
}

module.exports = { register, login };