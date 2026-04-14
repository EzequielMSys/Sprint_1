const usuarioService = require('../services/usuarioService');\nconst { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');\n
async function atualizar(req, res) {
  try {
    const usuarioId = req.params.id;
    const usuarioLogado = req.usuario;
    const dados = req.body;

    const resultado = await usuarioService.atualizar(usuarioId, dados, usuarioLogado);
    return res.json({ message: 'Usuário atualizado', usuario: resultado });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    if (error.message.includes('Permissão') || error.message.includes('Email')) {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno.' });
  }
}

async function alterarStatus(req, res) {
  try {
    const usuarioId = req.params.id;
    const { ativo } = req.body;

    if (ativo === undefined) {
      return res.status(400).json({ message: 'Campo ativo é obrigatório.' });
    }

    const resultado = await usuarioService.ativarDesativar(usuarioId, ativo ? 1 : 0);
    const status = ativo ? 'ativado' : 'desativado';
    return res.json({ message: `Usuário ${status} com sucesso`, usuario: resultado });
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    return res.status(500).json({ message: 'Erro interno.' });
  }
}

async function resetarSenha(req, res) {
  try {
    const usuarioId = req.params.id;

    const resultado = await usuarioService.resetarSenha(usuarioId);

    return res.json({
      message: 'Senha redefinida. Usuário deve trocar no próximo login.',
      senha_temporaria: resultado.senha_temporaria
    });
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    return res.status(500).json({ message: 'Erro interno.' });
  }
}

module.exports = {
  listar,
  obterPerfilLogado,
  atualizar,
  alterarStatus,
  resetarSenha
};

