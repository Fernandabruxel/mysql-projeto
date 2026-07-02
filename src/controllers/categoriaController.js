const CategoriaModel = require('../models/categoriaModel');

async function createCategoria(req, res) {
    try {
        const { nome } = req.body;

        // Validação: verifica se o usuário está autenticado
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        if (!nome) {
            return res.status(400).json({ mensagem: "Nome da categoria é obrigatório." });
        }

        // Verifica se já existe
        const existe = await CategoriaModel.findByName(nome);
        if (existe) {
            return res.status(400).json({ mensagem: "Categoria já existe." });
        }

        const id = await CategoriaModel.create({ nome });

        return res.status(201).json({
            mensagem: "Categoria criada com sucesso.",
            categoria: { id_categoria: id, nome }
        });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao criar categoria." });
    }
}

async function getCategorias(req, res) {
    try {
        // Validação: verifica se o usuário está autenticado
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const categorias = await CategoriaModel.findAll();
        return res.json(categorias);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao listar categorias." });
    }
}

async function getCategoriaById(req, res) {
    try {
        // Validação: verifica se o usuário está autenticado
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const categoria = await CategoriaModel.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ mensagem: "Categoria não encontrada." });
        }
        return res.json(categoria);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao buscar categoria." });
    }
}

async function updateCategoria(req, res) {
    try {
        // Validação: verifica se o usuário está autenticado
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ mensagem: "Nome da categoria é obrigatório." });
        }

        const categoria = await CategoriaModel.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ mensagem: "Categoria não encontrada." });
        }

        const atualizado = await CategoriaModel.update(req.params.id, { nome });
        if (!atualizado) {
            return res.status(500).json({ mensagem: "Erro ao atualizar categoria." });
        }

        return res.json({ mensagem: "Categoria atualizada com sucesso." });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao atualizar categoria." });
    }
}

async function deleteCategoria(req, res) {
    try {
        // Validação: verifica se o usuário está autenticado
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const categoria = await CategoriaModel.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ mensagem: "Categoria não encontrada." });
        }

        const deletado = await CategoriaModel.delete(req.params.id);
        if (!deletado) {
            return res.status(500).json({ mensagem: "Erro ao deletar categoria." });
        }

        return res.json({ mensagem: "Categoria deletada com sucesso." });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao deletar categoria." });
    }
}

module.exports = {
    createCategoria,
    getCategorias,
    getCategoriaById,
    updateCategoria,
    deleteCategoria
};