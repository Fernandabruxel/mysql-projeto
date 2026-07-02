const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    createCliente,
    getClientes,
    getClienteById,
    updateCliente,
    deleteCliente
} = require('../controllers/clienteController');

router.use(authMiddleware);

router.post('/', createCliente);
router.get('/', getClientes);
router.get('/:id', getClienteById);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente);

module.exports = router;