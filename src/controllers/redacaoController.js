const redacaoModel = require('../models/redacaoModel');
function gerarFeedbackAutomatico(texto) {
  const comprimento = texto.length;
  if (comprimento < 500) {
    return {
      nota: 60.0,
      feedback: 'Redação curta. Desenvolva melhor os argumentos e aumente o número de linhas.'
    };
  }
  if (comprimento < 1500) {
    return {
      nota: 80.0,
      feedback: 'Bom desenvolvimento. Você pode aprimorar a coesão e a proposta de intervenção.'
    };
  }
  return {
    nota: 90.0,
    feedback: 'Excelente extensão e desenvolvimento. Revise aspectos gramaticais finos e conectivos.'
  };
}
async function enviarRedacao(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const { tema, texto } = req.body;
    if (!tema || !texto) {
      return res.status(400).json({ message: 'Tema e texto são obrigatórios.' });
    }
    const avaliacao = gerarFeedbackAutomatico(texto);
    const redacao = await redacaoModel.criarRedacao(usuarioId, {
      tema,
      texto,
      nota: avaliacao.nota,
      feedback: avaliacao.feedback
    });
    return res.status(201).json({
      message: 'Redação enviada com sucesso.',
      redacao
    });
  } catch (error) {
    console.error('Erro ao enviar redação:', error);
    return res.status(500).json({ message: 'Erro interno ao enviar redação.' });
  }
}
async function listarRedacoes(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const redacoes = await redacaoModel.listarPorUsuario(usuarioId);
    return res.json(redacoes);
  } catch (error) {
    console.error('Erro ao listar redações:', error);
    return res.status(500).json({ message: 'Erro interno ao listar redações.' });
  }
}
module.exports = {
  enviarRedacao,
  listarRedacoes
};