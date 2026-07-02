const db = require('../config/database');

class CategoriaModel {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM categorias ORDER BY nome');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            'SELECT * FROM categorias WHERE id_categoria = ?',
            [id]
        );
        return rows[0];
    }

    static async findByName(nome) {
        const [rows] = await db.query(
            'SELECT * FROM categorias WHERE nome = ?',
            [nome]
        );
        return rows[0];
    }

    static async create(categoria) {
        const { nome } = categoria;
        const [result] = await db.query(
            'INSERT INTO categorias (nome) VALUES (?)',
            [nome]
        );
        return result.insertId;
    }

    static async update(id, categoria) {
        const { nome } = categoria;
        const [result] = await db.query(
            'UPDATE categorias SET nome = ? WHERE id_categoria = ?',
            [nome, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM categorias WHERE id_categoria = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = CategoriaModel;