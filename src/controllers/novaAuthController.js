const authService = require('../services/authService');\n
/**
 * @swagger
 * /api/auth/esqueci-senha:
 *   post:
 *     summary: Recuperação de senha sem email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha temporária gerada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 senha_temporaria:
 *                   type: string
 *       404:
 *         description: Email não encontrado
 */
async function esqueciSenha(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email é obrigatório.' });
    }

    const resultado = await authService.esqueciSenha(email);

    return res.json({
      message: 'Senha temporária gerada. Guarde-a e altere no primeiro login.',
      senha_temporaria: resultado.senha_temporaria
    });
  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    return res.status(500).json({ message: 'Erro interno.' });
  }
}

/**
 * @swagger
 * /api/auth/trocar-senha-primeiro-acesso:
 *   post:
 *     summary: Troca obrigatória no primeiro acesso
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senha_atual:
 *                 type: string
 *               nova_senha:
 *                 type: string
 *               confirmar_senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha alterada
 */
async function trocarSenhaPrimeiroAcesso(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { senha_atual, nova_senha, confirmar_senha } = req.body;

    if (!senha_atual || !nova_senha || !confirmar_senha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    if (nova_senha !== confirmar_senha) {
      return res.status(400).json({ message: 'Senhas não coincidem.' });
    }

    await authService.trocarSenhaPrimeiroAcesso(usuarioId, senha_atual, nova_senha);

    return res.json({ message: 'Senha alterada com sucesso. Agora você pode acessar o sistema.' });
  } catch (error) {
    console.error('Erro ao trocar senha primeiro acesso:', error);
    if (error.message.includes('Senha atual')) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno.' });
  }
}

/**
 * @swagger
 * /api/auth/alterar-senha:
 *   post:
 *     summary: Alterar senha do usuário
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senha_atual:
 *                 type: string
 *               nova_senha:
 *                 type: string
 *               confirmar_senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha alterada
 */
async function alterarSenha(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { senha_atual, nova_senha, confirmar_senha } = req.body;

    if (!senha_atual || !nova_senha || !confirmar_senha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    if (nova_senha !== confirmar_senha) {
      return res.status(400).json({ message: 'Senhas não coincidem.' });
    }

    await authService.alterarSenha(usuarioId, senha_atual, nova_senha);

    return res.json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    if (error.message.includes('Senha atual')) {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno.' });
  }
}

module.exports = {
  esqueciSenha,
  trocarSenhaPrimeiroAcesso,
  alterarSenha
};

