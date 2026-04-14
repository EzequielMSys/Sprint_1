const pool = require('../config/db');
const { obterPerfilPorUsuario, obterDisponibilidade } = require('../models/perfilEstudoModel');
const conteudoModel = require('../models/conteudoModel');

class CronogramaService {
  async gerar(usuarioId) {
    // Obtém perfil e disponibilidade do usuário
    const perfil = await obterPerfilPorUsuario(usuarioId);
    const disponibilidade = await obterDisponibilidade(usuarioId);
    
    if (!perfil) {
      throw new Error('Perfil de estudo não configurado');
    }

    // Lógica "AI" - distribui matérias por dia baseado em disponibilidade
    const materias = ['Matemática', 'Português', 'Biologia', 'Física', 'Química', 'História'];
    const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    
    const cronograma = diasSemana.map((dia, index) => {
      // Pula dias ocupados
      const diaDisp = disponibilidade.find(d => d.dia_semana === index + 1);
      if (diaDisp && diaDisp.ocupado) {
        return null;
      }

      // Distribui 2-3 matérias por dia
      const materiasDia = [];
      const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
      const topicosPorMateria = ['Funções', 'Equações', 'Geometria', 'Interpretação', 'Gramática', 'Redação'];

      for (let i = 0; i < Math.floor(perfil.horas_diarias / 2); i++) {
        const materiaAleatoria = shuffle(materias.slice())[0];
        const topicoAleatorio = shuffle(topicosPorMateria.slice())[0];
        materiasDia.push({ materia: materiaAleatoria, topico: topicoAleatorio });
      }

      return {
        dia_semana: dia,
        data: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        atividades: materiasDia,
        duracao: perfil.horas_diarias,
        concluido: false
      };
    }).filter(Boolean);

    // Salva no banco
    return await this.salvarCronograma(usuarioId, cronograma);
  }

  async salvarCronograma(usuarioId, cronograma) {
    // Limpa cronogramas antigos
    await pool.execute('DELETE FROM cronogramas WHERE usuario_id = ?', [usuarioId]);

    // Salva novo
    const [result] = await pool.execute(
      'INSERT INTO cronogramas (usuario_id, titulo, data_inicio, data_fim) VALUES (?, ?, ?, ?)',
      [usuarioId, 'Cronograma Semanal IA', cronograma[0].data, cronograma[cronograma.length - 1].data]
    );

    const cronogramaId = result.insertId;
    
    for (const dia of cronograma) {
      const [diaResult] = await pool.execute(
        'INSERT INTO cronograma_dias (cronograma_id, data_estudo) VALUES (?, ?)',
        [cronogramaId, dia.data]
      );

      for (const atividade of dia.atividades) {
        await pool.execute(
          'INSERT INTO cronograma_conteudos (dia_id, conteudo_id, materia, topico, concluido) VALUES (?, ?, ?, ?, ?)',
          [diaResult.insertId, null, atividade.materia, atividade.topico, false]
        );
      }
    }

    return { id: cronogramaId, dias: cronograma };
  }

  async listar(usuarioId) {
    const [rows] = await pool.execute(
      `SELECT c.*, cd.data_estudo, GROUP_CONCAT(CONCAT(cc.materia, ': ', cc.topico) SEPARATOR ' | ') as atividades
       FROM cronogramas c
       LEFT JOIN cronograma_dias cd ON c.id = cd.cronograma_id
       LEFT JOIN cronograma_conteudos cc ON cd.id = cc.dia_id
       WHERE c.usuario_id = ? 
       GROUP BY c.id, cd.id
       ORDER BY cd.data_estudo`
    );
    return rows;
  }

  async marcarConcluido(diaId) {
    await pool.execute(
      'UPDATE cronograma_conteudos SET concluido = 1 WHERE dia_id = ?',
      [diaId]
    );
  }
}

module.exports = new CronogramaService();

