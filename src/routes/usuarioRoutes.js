const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authMiddleware, isAdminOrDono } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, isAdminOrDono, usuarioController.listar);
router.get('/me', authMiddleware, usuarioController.obterPerfilLogado);
router.put('/:id', authMiddleware, usuarioController.atualizar);
router.patch('/:id/tipo', authMiddleware, isAdminOrDono, usuarioController.alterarTipo);
router.patch('/:id/status', authMiddleware, isAdminOrDono, usuarioController.alterarStatus);
router.patch('/:id/resetar-senha', authMiddleware, isAdminOrDono, usuarioController.resetarSenha);

module.exports = router;
