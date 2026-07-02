const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    createProduto,
    getProdutos,
    getProdutoById,
    updateProduto,
    deleteProduto
} = require('../controllers/produtoController');

router.use(authMiddleware); // Todas as rotas precisam de autenticação

router.post('/', createProduto);
router.get('/', getProdutos);
router.get('/:id', getProdutoById);
router.put('/:id', updateProduto);
router.delete('/:id', deleteProduto);

module.exports = router;