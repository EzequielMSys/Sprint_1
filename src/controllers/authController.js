const authService = require('../services/authService');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [aluno, admin]
 *     responses:
 *       201:
 *         description: Usuário criado com senha temporária
 */
async function registrar(req, res) {
  try {
    const { nome, email, tipo, senha } = req.body;
    if (!nome || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
    }

    const resultado = await authService.registrar({ nome, email, tipo, senha });

    return res.status(201).json({
      message: 'Usuário criado com sucesso. Use a senha temporária para o primeiro acesso.',
      senha_temporaria: resultado.senha_temporaria,
      usuario: {
        id: resultado.id,
        nome: resultado.nome,
        email: resultado.email,
        tipo: resultado.tipo
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    if (error.message === 'Email já cadastrado') {
      return res.status(409).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
  }
}

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login sucesso
 */
async function login(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const resultado = await authService.login(email, senha);

    return res.json({
      token: resultado.token,
      usuario: resultado.usuario,
      primeiro_acesso: resultado.primeiro_acesso
    });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    if (error.status === 403 || error.message === 'Usuário desativado') {
      return res.status(403).json({ error: error.message || 'Usuário desativado' });
    }
    if (error.message === 'Usuário não encontrado' || error.message === 'Senha incorreta') {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    return res.status(500).json({ error: 'Erro interno ao autenticar.' });
  }
}

module.exports = {
  registrar,
  login,
  esqueciSenha: require('./novaAuthController').esqueciSenha,
  trocarSenhaPrimeiroAcesso: require('./novaAuthController').trocarSenhaPrimeiroAcesso,
  alterarSenha: require('./novaAuthController').alterarSenha
};


