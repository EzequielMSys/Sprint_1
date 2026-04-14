const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, isAdmin, usuarioController.listar);
router.get('/me', authMiddleware, usuarioController.obterPerfilLogado);
router.put('/:id', authMiddleware, usuarioController.atualizar);
router.patch('/:id/status', authMiddleware, isAdmin, usuarioController.alterarStatus);
router.patch('/:id/resetar-senha', authMiddleware, isAdmin, usuarioController.resetarSenha);

module.exports = router;

