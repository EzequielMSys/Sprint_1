const atividadeModel = require('../models/atividadeModel');
const respostaModel = require('../models/respostaModel');
async function responderAtividade(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { atividade_id, resposta } = req.body;
    if (!atividade_id || !resposta) {
      return res.status(400).json({ message: 'atividade_id e resposta são obrigatórios.' });
    }
    const atividade = await atividadeModel.buscarPorId(atividade_id);
    if (!atividade) {
      return res.status(404).json({ message: 'Atividade não encontrada.' });
    }
    const correto = atividade.resposta_correta === resposta;
    const registro = await respostaModel.registrarResposta(usuarioId, atividade_id, resposta, correto);
    return res.status(201).json({
      message: 'Resposta registrada.',
      resultado: { correto, ...registro }
    });
  } catch (error) {
    console.error('Erro ao responder atividade:', error);
    return res.status(500).json({ message: 'Erro interno ao responder atividade.' });
  }
}
async function historicoDesempenho(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const historico = await respostaModel.obterHistoricoPorUsuario(usuarioId);
    const total = historico.length;
    const acertos = historico.filter(h => h.correto).length;
    const desempenhoGeral = total > 0 ? (acertos / total) * 100 : 0;
    return res.json({ desempenhoGeral, total, acertos, historico });
  } catch (error) {
    console.error('Erro ao obter histórico de desempenho:', error);
    return res.status(500).json({ message: 'Erro interno ao obter histórico.' });
  }
}
module.exports = {
  responderAtividade,
  historicoDesempenho
};