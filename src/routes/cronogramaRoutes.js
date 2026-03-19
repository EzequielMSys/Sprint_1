const express = require('express');
const router = express.Router();
const cronogramaController = require('../controllers/cronogramaController');
const { authMiddleware } = require('../middlewares/authMiddleware');
router.post('/gerar', authMiddleware, cronogramaController.gerar);
router.get('/', authMiddleware, cronogramaController.obterCronogramaAtual);
module.exports = router;
