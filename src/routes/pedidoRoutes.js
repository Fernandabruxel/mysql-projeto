const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    createPedido,
    getPedidos,
    getPedidoById,
    deletePedido
} = require('../controllers/pedidoController');

router.use(authMiddleware);

router.post('/', createPedido);
router.get('/', getPedidos);
router.get('/:id', getPedidoById);
router.delete('/:id', deletePedido);

module.exports = router;