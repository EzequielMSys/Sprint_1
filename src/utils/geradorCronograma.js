const perfilModel = require('../models/perfilEstudoModel');
const dispModel = require('../models/disponibilidadeSemanaModel');
const cronogramaModel = require('../models/cronogramaModel');
const cronogramaDiaModel = require('../models/cronogramaDiaModel');
const cronogramaConteudoModel = require('../models/cronogramaConteudoModel');
const conteudoModel = require('../models/conteudoModel');

const DIAS_SEMANA = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

/**
 * Adiciona dias a uma data
 */
function adicionarDias(data, dias) {
  const nova = new Date(data);
  nova.setDate(nova.getDate() + dias);
  return nova;
}

/**
 * Formata data para ISO string (YYYY-MM-DD)
 */
function formatarDataISO(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Busca conteúdos relevantes para as áreas de foco
 */
async function buscarConteudosRelevantes(areasFoco, tempo_objetivo) {
  const areas = areasFoco.split(',').map(a => a.trim());
  const todosConteudos = [];

  // Determina nível baseado no tempo objetivo (dias)
  let nivel = 'basico';
  if (tempo_objetivo > 60) nivel = 'intermediario';
  if (tempo_objetivo > 120) nivel = 'avancado';

  for (const area of areas) {
    const conteudos = await conteudoModel.buscarRelevantes(area, nivel);
    todosConteudos.push(...conteudos);
  }

  return todosConteudos;
}

/**
 * Gera cronograma para um usuário
 */
async function gerarCronogramaParaUsuario(usuarioId) {
  // Obtém perfil
  const perfil = await perfilModel.obterPerfilPorUsuario(usuarioId);
  if (!perfil) {
    throw new Error('Perfil de estudo não encontrado. Configure o perfil antes de gerar o cronograma.');
  }

  // Obtém disponibilidade
  const disponibilidade = await dispModel.obterDisponibilidadePorUsuario(usuarioId);
  if (!disponibilidade || disponibilidade.length === 0) {
    throw new Error('Disponibilidade semanal não configurada.');
  }

  // Busca conteúdos
  const conteudos = await buscarConteudosRelevantes(
    perfil.areas_foco || 'Geral',
    perfil.prazo_estimado || 30
  );

  if (conteudos.length === 0) {
    throw new Error('Não há conteúdos cadastrados para as áreas de foco informadas.');
  }

  // Cria cronograma
  const hoje = new Date();
  const dataInicio = hoje;
  const dataFim = adicionarDias(dataInicio, perfil.prazo_estimado || 30);

  const cronograma = await cronogramaModel.criarCronograma(perfil.id_perfil, {
    data_inicio: formatarDataISO(dataInicio),
    data_fim: formatarDataISO(dataFim),
    status: 'ativo'
  });

  // Filtra dias disponíveis
  const diasDisponiveisPorSemana = disponibilidade
    .filter(d => !d.ocupado)
    .map(d => d.dia_semana);

  if (diasDisponiveisPorSemana.length === 0) {
    throw new Error('Nenhum dia disponível para estudo foi configurado.');
  }

  // Distribui conteúdos ao longo do período
  let dataAtual = new Date(dataInicio);
  const totalDias = perfil.prazo_estimado || 30;
  let indiceConteudo = 0;

  for (let i = 0; i < totalDias; i++) {
    const diaSemanaIdx = dataAtual.getDay();
    const nomeDiaSemana = DIAS_SEMANA[diaSemanaIdx];

    // Só cria dia se está disponível
    if (diasDisponiveisPorSemana.includes(nomeDiaSemana)) {
      const dia = await cronogramaDiaModel.criarDia(cronograma.id_cronograma, {
        data_estudo: formatarDataISO(dataAtual),
        tempo_previsto: perfil.tempo_diario_min || 120
      });

      // Distribui conteúdos no dia
      const quantidadeSlots = Math.max(1, Math.floor((perfil.tempo_diario_min || 120) / 30));
      for (let s = 0; s < quantidadeSlots && conteudos.length > 0; s++) {
        const conteudo = conteudos[indiceConteudo % conteudos.length];
        await cronogramaConteudoModel.atribuirConteudoAoDia(dia.id_dia, conteudo.id_conteudo);
        indiceConteudo++;
      }
    }

    dataAtual = adicionarDias(dataAtual, 1);
  }

  return cronogramaModel.obterCronogramaCompleto(cronograma.id_cronograma);
}

module.exports = {
  gerarCronogramaParaUsuario
};