const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const { authMiddleware } = require('../middlewares/authMiddleware');
router.post('/', authMiddleware, perfilController.salvarPerfil);
router.post('/disponibilidade', authMiddleware, perfilController.salvarDisponibilidade);
router.get('/', authMiddleware, perfilController.obterPerfilCompleto);
module.exports = router;