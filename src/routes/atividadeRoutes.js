const express = require('express');
const router = express.Router();
const atividadeController = require('../controllers/atividadeController');
const { authMiddleware } = require('../middlewares/authMiddleware');
router.post('/responder', authMiddleware, atividadeController.responderAtividade);
router.get('/historico', authMiddleware, atividadeController.historicoDesempenho);
module.exports = router;