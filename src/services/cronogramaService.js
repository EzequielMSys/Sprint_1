const pool = require('../config/db');
const perfilModel = require('../models/perfilEstudoModel');
const dispModel = require('../models/disponibilidadeSemanaModel');
const cronogramaModel = require('../models/cronogramaModel');
const cronogramaDiaModel = require('../models/cronogramaDiaModel');
const cronogramaConteudoModel = require('../models/cronogramaConteudoModel');
const conteudoModel = require('../models/conteudoModel');

class CronogramaService {
  /**
   * Gera cronograma para um usuário baseado em seu perfil
   */
  async gerar(usuarioId) {
    // Obtém perfil do usuário
    const perfil = await perfilModel.obterPerfilPorUsuario(usuarioId);
    if (!perfil) {
      throw new Error('Perfil de estudo não configurado');
    }

    // Obtém disponibilidade
    const disponibilidade = await dispModel.obterDisponibilidadePorUsuario(usuarioId);
    if (!disponibilidade || disponibilidade.length === 0) {
      throw new Error('Disponibilidade semanal não configurada');
    }

    // Busca conteúdos relevantes
    const areas = perfil.areas_foco ? perfil.areas_foco.split(',').map(a => a.trim()) : ['Geral'];
    const conteudos = [];
    for (const area of areas) {
      const items = await conteudoModel.buscarRelevantes(area);
      conteudos.push(...items);
    }

    if (conteudos.length === 0) {
      throw new Error('Nenhum conteúdo cadastrado para as áreas de foco informadas');
    }

    // Calcula datas
    const hoje = new Date();
    const dataFim = new Date(hoje);
    dataFim.setDate(dataFim.getDate() + (perfil.prazo_estimado || 30));

    // Cria cronograma
    const cronograma = await cronogramaModel.criarCronograma(perfil.id_perfil, {
      data_inicio: hoje.toISOString().split('T')[0],
      data_fim: dataFim.toISOString().split('T')[0],
      status: 'ativo'
    });

    // Dias disponíveis por semana
    const diasDisponiveis = disponibilidade
      .filter(d => !d.ocupado)
      .map(d => d.dia_semana);

    if (diasDisponiveis.length === 0) {
      throw new Error('Nenhum dia disponível para estudo foi configurado');
    }

    // Mapeamento de dia da semana para número
    const diasSemana = {
      'domingo': 0,
      'segunda': 1,
      'terca': 2,
      'quarta': 3,
      'quinta': 4,
      'sexta': 5,
      'sabado': 6
    };

    // Distribui conteúdos ao longo dos dias
    let dataAtual = new Date(hoje);
    let indiceConteudo = 0;
    const diasParaGerar = perfil.prazo_estimado || 30;
    const tempoParaAlmoco = 60; // minutos

    for (let i = 0; i < diasParaGerar; i++) {
      const nomeDia = Object.keys(diasSemana).find(k => diasSemana[k] === dataAtual.getDay());

      if (diasDisponiveis.includes(nomeDia)) {
        const dia = await cronogramaDiaModel.criarDia(cronograma.id_cronograma, {
          data_estudo: dataAtual.toISOString().split('T')[0],
          tempo_previsto: perfil.tempo_diario_min || 120
        });

        // Atribui conteúdos ao dia
        const quantidadeSlots = Math.max(1, Math.floor((perfil.tempo_diario_min || 120) / 30));
        for (let s = 0; s < quantidadeSlots && conteudos.length > 0; s++) {
          const conteudo = conteudos[indiceConteudo % conteudos.length];
          await cronogramaConteudoModel.atribuirConteudoAoDia(dia.id_dia, conteudo.id_conteudo);
          indiceConteudo++;
        }
      }

      dataAtual.setDate(dataAtual.getDate() + 1);
    }

    return cronogramaModel.obterCronogramaCompleto(cronograma.id_cronograma);
  }

  /**
   * Lista cronogramas de um usuário
   */
  async listar(usuarioId) {
    const perfil = await perfilModel.obterPerfilPorUsuario(usuarioId);
    if (!perfil) {
      return [];
    }

    const cronogramas = await cronogramaModel.listarCronogramasPorPerfil(perfil.id_perfil);
    
    // Enriquece cada cronograma com dados de dias
    for (const cronograma of cronogramas) {
      const dias = await cronogramaDiaModel.listarDiasPorCronograma(cronograma.id_cronograma);
      cronograma.dias = dias;
    }

    return cronogramas;
  }

  /**
   * Marca um dia como concluído
   */
  async marcarConcluido(idDia) {
    await cronogramaConteudoModel.marcarTodosConcluidos(idDia);
    return { id_dia: idDia, status: 'concluído' };
  }

  /**
   * Atualiza status do cronograma
   */
  async atualizarStatus(idCronograma, status) {
    return await cronogramaModel.atualizarStatusCronograma(idCronograma, status);
  }
}

module.exports = new CronogramaService();

