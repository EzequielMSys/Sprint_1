const pool = require('../config/db');
const cronogramaModel = require('../models/cronogramaModel');
const perfilModel = require('../models/perfilEstudoModel');
const dispModel = require('../models/disponibilidadeSemanaModel');
const DIAS_SEMANA = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
function adicionarDias(data, dias) {
  const nova = new Date(data);
  nova.setDate(nova.getDate() + dias);
  return nova;
}
function formatarDataISO(date) {
  return date.toISOString().slice(0, 10);
}
async function buscarConteudosRelevantes(area_foco, tempo_objetivo) {
  const nivel = tempo_objetivo <= 60 ? 'avancado' : tempo_objetivo <= 120 ? 'intermediario' : 'basico';
  const [rows] = await pool.execute(
    `SELECT * FROM conteudos
     WHERE materia LIKE ? AND nivel = ?
     ORDER BY id ASC`,
    [`%${area_foco}%`, nivel]
  );
  return rows;
}
async function gerarCronogramaParaUsuario(usuarioId) {
  const perfil = await perfilModel.obterPerfilPorUsuario(usuarioId);
  if (!perfil) {
    throw new Error('Perfil de estudo não encontrado. Configure o perfil antes de gerar o cronograma.');
  }
  const disponibilidade = await dispModel.obterDisponibilidade(usuarioId);
  if (!disponibilidade || disponibilidade.length === 0) {
    throw new Error('Disponibilidade semanal não configurada.');
  }
  const conteudos = await buscarConteudosRelevantes(perfil.area_foco, perfil.tempo_objetivo);
  if (conteudos.length === 0) {
    throw new Error('Não há conteúdos cadastrados para a área de foco informada.');
  }
  const hoje = new Date();
  const dataInicio = hoje;
  const dataFim = adicionarDias(dataInicio, perfil.tempo_objetivo);
  const cronograma = await cronogramaModel.criarCronograma(usuarioId, {
    titulo: `Cronograma para ${perfil.processo_seletivo}`,
    data_inicio: formatarDataISO(dataInicio),
    data_fim: formatarDataISO(dataFim)
  });
  const diasDisponiveisPorSemana = disponibilidade.filter(d => !d.ocupado).map(d => d.dia_semana);
  if (diasDisponiveisPorSemana.length === 0) {
    throw new Error('Nenhum dia disponível para estudo foi configurado.');
  }
  let dataAtual = new Date(dataInicio);
  const totalDias = perfil.tempo_objetivo;
  let indiceConteudo = 0;
  for (let i = 0; i <= totalDias; i++) {
    const diaSemanaIdx = dataAtual.getDay();
    const nomeDiaSemana = DIAS_SEMANA[diaSemanaIdx];
    if (diasDisponiveisPorSemana.includes(nomeDiaSemana)) {
      const dia = await cronogramaModel.criarDia(cronograma.id, formatarDataISO(dataAtual));
      const quantidadeSlots = Math.max(1, perfil.horas_diarias);
      for (let s = 0; s < quantidadeSlots; s++) {
        const conteudo = conteudos[indiceConteudo % conteudos.length];
        await cronogramaModel.atribuirConteudoAoDia(dia.id, conteudo.id);
        indiceConteudo++;
      }
    }
    dataAtual = adicionarDias(dataAtual, 1);
  }
  return cronogramaModel.obterCronogramaCompleto(usuarioId);
}
module.exports = {
  gerarCronogramaParaUsuario
};