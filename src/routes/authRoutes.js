const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', authController.registrar);
router.post('/login', authController.login);
router.post('/esqueci-senha', authController.esqueciSenha);
router.post('/trocar-senha-primeiro-acesso', authMiddleware, authController.trocarSenhaPrimeiroAcesso);
router.post('/alterar-senha', authMiddleware, authController.alterarSenha);

module.exports = router;