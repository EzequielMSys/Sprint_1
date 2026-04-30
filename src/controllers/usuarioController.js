const usuarioService = require('../services/usuarioService');

async function listar(req, res) {
  try {
    const usuarios = await usuarioService.listar();
    return res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuarios:', error);
    return res.status(500).json({ error: 'Erro interno ao listar usuarios.' });
  }
}

async function obterPerfilLogado(req, res) {
  try {
    const usuario = await usuarioService.obterPerfilLogado(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario nao encontrado.' });
    }
    return res.json(usuario);
  } catch (error) {
    console.error('Erro ao obter usuario logado:', error);
    return res.status(500).json({ error: 'Erro interno.' });
  }
}

async function atualizar(req, res) {
  try {
    const usuarioId = req.params.id;
    const usuarioLogado = req.usuario;
    const dados = req.body;

    const resultado = await usuarioService.atualizar(usuarioId, dados, usuarioLogado);
    return res.json({ message: 'Usuario atualizado', usuario: resultado });
  } catch (error) {
    console.error('Erro ao atualizar usuario:', error);
    if (error.message.includes('Permissao') || error.message.includes('Email')) {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Erro interno.' });
  }
}

async function alterarTipo(req, res) {
  try {
    const usuarioId = req.params.id;
    const { tipo } = req.body;
    const usuarioLogado = req.usuario;

    if (!tipo) {
      return res.status(400).json({ error: 'Campo tipo e obrigatorio.' });
    }

    const resultado = await usuarioService.alterarTipo(usuarioId, tipo, usuarioLogado);
    return res.json({ message: 'Tipo de usuario alterado com sucesso', usuario: resultado });
  } catch (error) {
    console.error('Erro ao alterar tipo:', error);
    if (error.message.includes('Permissao')) {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Erro interno.' });
  }
}

async function alterarStatus(req, res) {
  try {
    const usuarioId = req.params.id;
    const { ativo } = req.body;

    if (ativo === undefined) {
      return res.status(400).json({ error: 'Campo ativo e obrigatorio.' });
    }

    const resultado = await usuarioService.ativarDesativar(usuarioId, ativo ? 1 : 0);
    const status = ativo ? 'ativado' : 'desativado';
    return res.json({ message: `Usuario ${status} com sucesso`, usuario: resultado });
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    return res.status(500).json({ error: 'Erro interno.' });
  }
}

async function resetarSenha(req, res) {
  try {
    const usuarioId = req.params.id;

    const resultado = await usuarioService.resetarSenha(usuarioId);

    return res.json({
      message: 'Senha redefinida. Usuario deve trocar no proximo login.',
      senha_temporaria: resultado.senha_temporaria
    });
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    return res.status(500).json({ error: 'Erro interno.' });
  }
}

module.exports = {
  listar,
  obterPerfilLogado,
  atualizar,
  alterarTipo,
  alterarStatus,
  resetarSenha
};
