const cronogramaService = require('../services/cronogramaService');

async function gerarCronograma(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const cronograma = await cronogramaService.gerar(usuarioId);
    
    console.log(`[CRONOGRAMA GERADO] User ${usuarioId} - ${cronograma.dias.length} dias`);
    
    return res.json({
      message: 'Cronograma gerado com sucesso!',
      cronograma
    });
  } catch (error) {
    console.error('Erro ao gerar cronograma:', error);
    return res.status(500).json({ error: 'Erro interno ao gerar cronograma' });
  }
}

async function listarCronogramas(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const cronogramas = await cronogramaService.listar(usuarioId);
    return res.json(cronogramas);
  } catch (error) {
    console.error('Erro ao listar cronogramas:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}

async function concluirDia(req, res) {
  try {
    const { diaId } = req.params;
    await cronogramaService.marcarConcluido(diaId);
    return res.json({ message: 'Dia marcado como concluído!' });
  } catch (error) {
    console.error('Erro ao concluir dia:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}

module.exports = {
  gerarCronograma,
  listarCronogramas,
  concluirDia
};

