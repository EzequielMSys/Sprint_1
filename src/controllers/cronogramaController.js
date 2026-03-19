const cronogramaModel = require('../models/cronogramaModel');
const { gerarCronogramaParaUsuario } = require('../utils/geradorCronograma');
async function gerar(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const cronograma = await gerarCronogramaParaUsuario(usuarioId);
    return res.status(201).json(cronograma);
  } catch (error) {
    console.error('Erro ao gerar cronograma:', error);
    return res.status(400).json({ message: error.message || 'Erro ao gerar cronograma.' });
  }
}
async function obterCronogramaAtual(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const cronograma = await cronogramaModel.obterCronogramaCompleto(usuarioId);
    if (!cronograma) {
      return res.status(404).json({ message: 'Nenhum cronograma encontrado.' });
    }
    return res.json(cronograma);
  } catch (error) {
    console.error('Erro ao obter cronograma:', error);
    return res.status(500).json({ message: 'Erro interno ao obter cronograma.' });
  }
}
module.exports = {
  gerar,
  obterCronogramaAtual
};