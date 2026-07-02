const PedidoModel = require('../models/pedidoModel');
const ClienteModel = require('../models/clienteModel');
const ProdutoModel = require('../models/produtoModel');

async function createPedido(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const { data, clientes_id_cliente, itens } = req.body;

        if (!clientes_id_cliente || !itens || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ mensagem: "Cliente e itens são obrigatórios." });
        }

        // Verifica se o cliente existe
        const cliente = await ClienteModel.findById(clientes_id_cliente);
        if (!cliente) {
            return res.status(400).json({ mensagem: "Cliente não encontrado." });
        }

        // Cria o pedido
        const pedidoId = await PedidoModel.create({
            data: data || new Date().toISOString().split('T')[0],
            clientes_id_cliente
        });

        // Adiciona os itens
        for (const item of itens) {
            const produto = await ProdutoModel.findById(item.produtos_id_produto);
            if (!produto) {
                return res.status(400).json({ 
                    mensagem: `Produto ${item.produtos_id_produto} não encontrado.` 
                });
            }
            await PedidoModel.addItem(
                pedidoId,
                item.produtos_id_produto,
                item.quantidade || 1,
                item.valor || produto.valor
            );
        }

        return res.status(201).json({
            mensagem: "Pedido criado com sucesso.",
            pedido: { id_pedido: pedidoId, clientes_id_cliente, data: data || new Date().toISOString().split('T')[0] }
        });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao criar pedido." });
    }
}

async function getPedidos(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const pedidos = await PedidoModel.findAll();
        return res.json(pedidos);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao listar pedidos." });
    }
}

async function getPedidoById(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const pedido = await PedidoModel.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ mensagem: "Pedido não encontrado." });
        }

        const itens = await PedidoModel.findItemsByPedidoId(req.params.id);
        return res.json({ ...pedido, itens });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao buscar pedido." });
    }
}

async function deletePedido(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const pedido = await PedidoModel.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ mensagem: "Pedido não encontrado." });
        }

        const deletado = await PedidoModel.delete(req.params.id);
        if (!deletado) {
            return res.status(500).json({ mensagem: "Erro ao deletar pedido." });
        }

        return res.json({ mensagem: "Pedido deletado com sucesso." });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao deletar pedido." });
    }
}

module.exports = {
    createPedido,
    getPedidos,
    getPedidoById,
    deletePedido
};