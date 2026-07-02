const db = require('../config/database');

class UsuarioModel {
    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT * FROM usuarios WHERE nick = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [id]
        );
        return rows[0];
    }

    static async create(usuario) {
        const { nome, nick, senha } = usuario;
        const [result] = await db.query(
            'INSERT INTO usuarios (nome, nick, senha) VALUES (?, ?, ?)',
            [nome, nick, senha]
        );
        return result.insertId;
    }
}

module.exports = UsuarioModel;