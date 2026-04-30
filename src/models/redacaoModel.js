const pool = require('../config/db');

/**
 * Cria uma nova redação
 */
async function criarRedacao(idUsuario, { tema, texto, notaEstimada = null, feedbackIa = null }) {
  const [result] = await pool.execute(
    `INSERT INTO redacoes (id_usuario, tema, texto, nota_estimada, feedback_ia)
     VALUES (?, ?, ?, ?, ?)`,
    [idUsuario, tema, texto, notaEstimada, feedbackIa]
  );
  return {
    id_redacao: result.insertId,
    id_usuario: idUsuario,
    tema,
    texto,
    nota_estimada: notaEstimada,
    feedback_ia: feedbackIa
  };
}

/**
 * Lista redações de um usuário
 */
async function listarPorUsuario(idUsuario) {
  const [rows] = await pool.execute(
    'SELECT * FROM redacoes WHERE id_usuario = ? ORDER BY enviada_em DESC',
    [idUsuario]
  );
  return rows;
}

/**
 * Obtém redação por ID
 */
async function obterRedacaoPorId(idRedacao) {
  const [rows] = await pool.execute(
    'SELECT * FROM redacoes WHERE id_redacao = ?',
    [idRedacao]
  );
  return rows[0];
}

/**
 * Atualiza feedback e nota de uma redação
 */
async function atualizarFeedback(idRedacao, notaEstimada, feedbackIa) {
  await pool.execute(
    `UPDATE redacoes
     SET nota_estimada = ?, feedback_ia = ?
     WHERE id_redacao = ?`,
    [notaEstimada, feedbackIa, idRedacao]
  );
  return { id_redacao: idRedacao, nota_estimada: notaEstimada, feedback_ia: feedbackIa };
}

/**
 * Deleta redação
 */
async function deletarRedacao(idRedacao) {
  await pool.execute(
    'DELETE FROM redacoes WHERE id_redacao = ?',
    [idRedacao]
  );
}

/**
 * Conta redações enviadas por um usuário
 */
async function contarRedacoesPorUsuario(idUsuario) {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as total FROM redacoes WHERE id_usuario = ?',
    [idUsuario]
  );
  return rows[0]?.total || 0;
}

/**
 * Obtém média de notas de um usuário
 */
async function mediaNotasUsuario(idUsuario) {
  const [rows] = await pool.execute(
    'SELECT AVG(nota_estimada) as media FROM redacoes WHERE id_usuario = ? AND nota_estimada IS NOT NULL',
    [idUsuario]
  );
  return rows[0]?.media || 0;
}

module.exports = {
  criarRedacao,
  listarPorUsuario,
  obterRedacaoPorId,
  atualizarFeedback,
  deletarRedacao,
  contarRedacoesPorUsuario,
  mediaNotasUsuario
};