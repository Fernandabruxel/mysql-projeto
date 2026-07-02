const db = require('../config/database');

class ProdutoModel {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT p.*, c.nome as categoria_nome 
            FROM produtos p
            LEFT JOIN categorias c ON p.categorias_id_categoria = c.id_categoria
            ORDER BY p.nome
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(`
            SELECT p.*, c.nome as categoria_nome 
            FROM produtos p
            LEFT JOIN categorias c ON p.categorias_id_categoria = c.id_categoria
            WHERE p.id_produto = ?
        `, [id]);
        return rows[0];
    }

    static async create(produto) {
        const { nome, valor, estoque, categorias_id_categoria } = produto;
        const [result] = await db.query(
            'INSERT INTO produtos (nome, valor, estoque, categorias_id_categoria) VALUES (?, ?, ?, ?)',
            [nome, valor, estoque, categorias_id_categoria]
        );
        return result.insertId;
    }

    static async update(id, produto) {
        const { nome, valor, estoque, categorias_id_categoria } = produto;
        const [result] = await db.query(
            'UPDATE produtos SET nome = ?, valor = ?, estoque = ?, categorias_id_categoria = ? WHERE id_produto = ?',
            [nome, valor, estoque, categorias_id_categoria, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM produtos WHERE id_produto = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async findByCategoria(categoriaId) {
        const [rows] = await db.query(
            'SELECT * FROM produtos WHERE categorias_id_categoria = ?',
            [categoriaId]
        );
        return rows;
    }
}

module.exports = ProdutoModel;