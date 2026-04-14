const express = require('express');
const router = express.Router();
const cronogramaController = require('../controllers/cronogramaController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/gerar', authMiddleware, cronogramaController.gerarCronograma);
router.get('/', authMiddleware, cronogramaController.listarCronogramas);
router.patch('/:diaId/concluir', authMiddleware, cronogramaController.concluirDia);

module.exports = router;

