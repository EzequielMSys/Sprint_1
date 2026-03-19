const usuarioModel = require('../models/usuarioModel');
async function listar(req, res) {
  try {
    const usuarios = await usuarioModel.listarUsuarios();
    return res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ message: 'Erro interno ao listar usuários.' });
  }
}
async function obterPerfilLogado(req, res) {
  try {
    const usuario = await usuarioModel.buscarPorId(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    return res.json(usuario);
  } catch (error) {
    console.error('Erro ao obter usuário logado:', error);
    return res.status(500).json({ message: 'Erro interno.' });
  }
}
module.exports = {
  listar,
  obterPerfilLogado
};