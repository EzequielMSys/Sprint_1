const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
router.get('/', authMiddleware, isAdmin, usuarioController.listar);\nrouter.get('/me', authMiddleware, usuarioController.obterPerfilLogado);\nrouter.put('/:id', authMiddleware, usuarioController.atualizar);\nrouter.patch('/:id/status', authMiddleware, isAdmin, usuarioController.alterarStatus);\nrouter.patch('/:id/resetar-senha', authMiddleware, isAdmin, usuarioController.resetarSenha);
module.exports = router;