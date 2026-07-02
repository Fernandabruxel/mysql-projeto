const db = require('../config/database');

class PedidoModel {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT p.*, c.nome as cliente_nome 
            FROM pedidos p
            LEFT JOIN clientes c ON p.clientes_id_cliente = c.id_cliente
            ORDER BY p.data DESC
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(`
            SELECT p.*, c.nome as cliente_nome 
            FROM pedidos p
            LEFT JOIN clientes c ON p.clientes_id_cliente = c.id_cliente
            WHERE p.id_pedido = ?
        `, [id]);
        return rows[0];
    }

    static async findItemsByPedidoId(pedidoId) {
        const [rows] = await db.query(`
            SELECT pp.*, pr.nome as produto_nome 
            FROM produtos_pedidos pp
            LEFT JOIN produtos pr ON pp.produtos_id_produto = pr.id_produto
            WHERE pp.pedidos_id_pedido = ?
        `, [pedidoId]);
        return rows;
    }

    static async create(pedido) {
        const { data, clientes_id_cliente } = pedido;
        const [result] = await db.query(
            'INSERT INTO pedidos (data, clientes_id_cliente) VALUES (?, ?)',
            [data, clientes_id_cliente]
        );
        return result.insertId;
    }

    static async addItem(pedidoId, produtoId, quantidade, valor) {
        const [result] = await db.query(
            'INSERT INTO produtos_pedidos (produtos_id_produto, pedidos_id_pedido, quantidade, valor) VALUES (?, ?, ?, ?)',
            [produtoId, pedidoId, quantidade, valor]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        // Primeiro remove os itens
        await db.query(
            'DELETE FROM produtos_pedidos WHERE pedidos_id_pedido = ?',
            [id]
        );
        // Depois remove o pedido
        const [result] = await db.query(
            'DELETE FROM pedidos WHERE id_pedido = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = PedidoModel;