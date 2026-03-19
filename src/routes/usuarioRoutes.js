const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
router.get('/', authMiddleware, isAdmin, usuarioController.listar);
router.get('/me', authMiddleware, usuarioController.obterPerfilLogado);
module.exports = router;