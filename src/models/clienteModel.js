const db = require('../config/database');

class ClienteModel {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM clientes ORDER BY nome');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            'SELECT * FROM clientes WHERE id_cliente = ?',
            [id]
        );
        return rows[0];
    }

    static async create(cliente) {
        const { nome, telefone, status } = cliente;
        const [result] = await db.query(
            'INSERT INTO clientes (nome, telefone, status) VALUES (?, ?, ?)',
            [nome, telefone, status || 'medio']
        );
        return result.insertId;
    }

    static async update(id, cliente) {
        const { nome, telefone, status } = cliente;
        const [result] = await db.query(
            'UPDATE clientes SET nome = ?, telefone = ?, status = ? WHERE id_cliente = ?',
            [nome, telefone, status, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query(
            'DELETE FROM clientes WHERE id_cliente = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = ClienteModel;