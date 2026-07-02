const ClienteModel = require('../models/clienteModel');

async function createCliente(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const { nome, telefone, status } = req.body;

        if (!nome || !telefone) {
            return res.status(400).json({ mensagem: "Nome e telefone são obrigatórios." });
        }

        const id = await ClienteModel.create({ nome, telefone, status });

        return res.status(201).json({
            mensagem: "Cliente criado com sucesso.",
            cliente: { id_cliente: id, nome, telefone, status }
        });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao criar cliente." });
    }
}

async function getClientes(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const clientes = await ClienteModel.findAll();
        return res.json(clientes);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao listar clientes." });
    }
}

async function getClienteById(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const cliente = await ClienteModel.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }
        return res.json(cliente);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao buscar cliente." });
    }
}

async function updateCliente(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const { nome, telefone, status } = req.body;

        const cliente = await ClienteModel.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }

        const atualizado = await ClienteModel.update(req.params.id, {
            nome: nome || cliente.nome,
            telefone: telefone || cliente.telefone,
            status: status || cliente.status
        });

        if (!atualizado) {
            return res.status(500).json({ mensagem: "Erro ao atualizar cliente." });
        }

        return res.json({ mensagem: "Cliente atualizado com sucesso." });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao atualizar cliente." });
    }
}

async function deleteCliente(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const cliente = await ClienteModel.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ mensagem: "Cliente não encontrado." });
        }

        const deletado = await ClienteModel.delete(req.params.id);
        if (!deletado) {
            return res.status(500).json({ mensagem: "Erro ao deletar cliente." });
        }

        return res.json({ mensagem: "Cliente deletado com sucesso." });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao deletar cliente." });
    }
}

module.exports = {
    createCliente,
    getClientes,
    getClienteById,
    updateCliente,
    deleteCliente
};