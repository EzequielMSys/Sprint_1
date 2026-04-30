const pool = require('../config/db');

/**
 * Cria novo cronograma para um perfil
 */
async function criarCronograma(idPerfil, { data_inicio, data_fim, status = 'ativo' }) {
  const [result] = await pool.execute(
    `INSERT INTO cronogramas (id_perfil, data_inicio, data_fim, status)
     VALUES (?, ?, ?, ?)`,
    [idPerfil, data_inicio, data_fim, status]
  );
  return { id_cronograma: result.insertId, id_perfil: idPerfil, data_inicio, data_fim, status };
}

/**
 * Lista cronogramas por perfil
 */
async function listarCronogramasPorPerfil(idPerfil) {
  const [rows] = await pool.execute(
    'SELECT * FROM cronogramas WHERE id_perfil = ? ORDER BY criado_em DESC',
    [idPerfil]
  );
  return rows;
}

/**
 * Obtém cronograma por ID
 */
async function obterCronogramaPorId(idCronograma) {
  const [rows] = await pool.execute(
    'SELECT * FROM cronogramas WHERE id_cronograma = ?',
    [idCronograma]
  );
  return rows[0];
}

/**
 * Atualiza status do cronograma
 */
async function atualizarStatusCronograma(idCronograma, status) {
  await pool.execute(
    'UPDATE cronogramas SET status = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id_cronograma = ?',
    [status, idCronograma]
  );
  return { id_cronograma: idCronograma, status };
}

/**
 * Deleta cronograma
 */
async function deletarCronograma(idCronograma) {
  await pool.execute(
    'DELETE FROM cronogramas WHERE id_cronograma = ?',
    [idCronograma]
  );
}

/**
 * Legacy function: obtém cronograma completo com dias e conteúdos
 * Mantido para backward compatibility com código existente
 */
async function obterCronogramaCompleto(idCronograma) {
  const [cronogramas] = await pool.execute(
    'SELECT * FROM cronogramas WHERE id_cronograma = ?',
    [idCronograma]
  );
  if (cronogramas.length === 0) return null;

  const cronograma = cronogramas[0];
  const [dias] = await pool.execute(
    'SELECT * FROM cronograma_dias WHERE id_cronograma = ? ORDER BY data_estudo ASC',
    [cronograma.id_cronograma]
  );

  for (const dia of dias) {
    const [conteudos] = await pool.execute(
      `SELECT cc.id, cc.concluido, c.*
       FROM cronograma_conteudos cc
       LEFT JOIN conteudos c ON c.id_conteudo = cc.id_conteudo
       WHERE cc.id_dia = ?`,
      [dia.id_dia]
    );
    dia.conteudos = conteudos;
  }

  cronograma.dias = dias;
  return cronograma;
}

module.exports = {
  criarCronograma,
  listarCronogramasPorPerfil,
  obterCronogramaPorId,
  atualizarStatusCronograma,
  deletarCronograma,
  obterCronogramaCompleto
};