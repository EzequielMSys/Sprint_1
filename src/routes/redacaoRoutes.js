const express = require('express');
const router = express.Router();
const redacaoController = require('../controllers/redacaoController');
const { authMiddleware } = require('../middlewares/authMiddleware');
router.post('/', authMiddleware, redacaoController.enviarRedacao);
router.get('/', authMiddleware, redacaoController.listarRedacoes);
module.exports = router;