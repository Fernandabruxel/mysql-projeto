const ProdutoModel = require('../models/produtoModel');
const CategoriaModel = require('../models/categoriaModel');

async function createProduto(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const { nome, valor, estoque, categorias_id_categoria } = req.body;

        if (!nome || !valor || !categorias_id_categoria) {
            return res.status(400).json({ mensagem: "Nome, valor e categoria são obrigatórios." });
        }

        // Verifica se a categoria existe
        const categoria = await CategoriaModel.findById(categorias_id_categoria);
        if (!categoria) {
            return res.status(400).json({ mensagem: "Categoria não encontrada." });
        }

        const id = await ProdutoModel.create({
            nome,
            valor,
            estoque: estoque || 1,
            categorias_id_categoria
        });

        return res.status(201).json({
            mensagem: "Produto criado com sucesso.",
            produto: { id_produto: id, nome, valor, estoque, categorias_id_categoria }
        });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao criar produto." });
    }
}

async function getProdutos(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const produtos = await ProdutoModel.findAll();
        return res.json(produtos);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao listar produtos." });
    }
}

async function getProdutoById(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const produto = await ProdutoModel.findById(req.params.id);
        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }
        return res.json(produto);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao buscar produto." });
    }
}

async function updateProduto(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const { nome, valor, estoque, categorias_id_categoria } = req.body;

        const produto = await ProdutoModel.findById(req.params.id);
        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }

        // Verifica se a categoria existe
        if (categorias_id_categoria) {
            const categoria = await CategoriaModel.findById(categorias_id_categoria);
            if (!categoria) {
                return res.status(400).json({ mensagem: "Categoria não encontrada." });
            }
        }

        const atualizado = await ProdutoModel.update(req.params.id, {
            nome: nome || produto.nome,
            valor: valor || produto.valor,
            estoque: estoque !== undefined ? estoque : produto.estoque,
            categorias_id_categoria: categorias_id_categoria || produto.categorias_id_categoria
        });

        if (!atualizado) {
            return res.status(500).json({ mensagem: "Erro ao atualizar produto." });
        }

        return res.json({ mensagem: "Produto atualizado com sucesso." });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao atualizar produto." });
    }
}

async function deleteProduto(req, res) {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ mensagem: "Usuário não autenticado." });
        }

        const produto = await ProdutoModel.findById(req.params.id);
        if (!produto) {
            return res.status(404).json({ mensagem: "Produto não encontrado." });
        }

        const deletado = await ProdutoModel.delete(req.params.id);
        if (!deletado) {
            return res.status(500).json({ mensagem: "Erro ao deletar produto." });
        }

        return res.json({ mensagem: "Produto deletado com sucesso." });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao deletar produto." });
    }
}

module.exports = {
    createProduto,
    getProdutos,
    getProdutoById,
    updateProduto,
    deleteProduto
};