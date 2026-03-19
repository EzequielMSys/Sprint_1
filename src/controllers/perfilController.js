const perfilModel = require('../models/perfilEstudoModel');
const dispModel = require('../models/disponibilidadeSemanaModel');
async function salvarPerfil(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const perfil = req.body;
    const perfilSalvo = await perfilModel.criarOuAtualizarPerfil(usuarioId, perfil);
    return res.status(201).json(perfilSalvo);
  } catch (error) {
    console.error('Erro ao salvar perfil de estudo:', error);
    return res.status(500).json({ message: 'Erro interno ao salvar perfil de estudo.' });
  }
}
async function salvarDisponibilidade(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { dias } = req.body;
    await dispModel.salvarDisponibilidade(usuarioId, dias || []);
    return res.status(201).json({ message: 'Disponibilidade salva com sucesso.' });
  } catch (error) {
    console.error('Erro ao salvar disponibilidade:', error);
    return res.status(500).json({ message: 'Erro interno ao salvar disponibilidade.' });
  }
}
async function obterPerfilCompleto(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const perfil = await perfilModel.obterPerfilPorUsuario(usuarioId);
    const disponibilidade = await dispModel.obterDisponibilidade(usuarioId);
    return res.json({ perfil, disponibilidade });
  } catch (error) {
    console.error('Erro ao obter perfil completo:', error);
    return res.status(500).json({ message: 'Erro interno.' });
  }
}
module.exports = {
  salvarPerfil,
  salvarDisponibilidade,
  obterPerfilCompleto
};