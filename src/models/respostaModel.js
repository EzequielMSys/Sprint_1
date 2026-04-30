const pool = require('../config/db');

/**
 * Registra uma resposta do usuário a uma atividade
 */
async function registrarResposta(idUsuario, idAtividade, resposta, correta = false) {
  const [result] = await pool.execute(
    `INSERT INTO respostas_usuario (id_usuario, id_atividade, resposta, correta)
     VALUES (?, ?, ?, ?)`,
    [idUsuario, idAtividade, resposta, correta ? 1 : 0]
  );
  return {
    id_resposta: result.insertId,
    id_usuario: idUsuario,
    id_atividade: idAtividade,
    resposta,
    correta: correta ? 1 : 0
  };
}

/**
 * Obtém histórico de respostas de um usuário
 */
async function obterHistoricoPorUsuario(idUsuario) {
  const [rows] = await pool.execute(
    `SELECT r.*, a.pergunta, a.tipo, c.disciplina, c.titulo as conteudo_titulo
     FROM respostas_usuario r
     JOIN atividades a ON a.id_atividade = r.id_atividade
     JOIN conteudos c ON c.id_conteudo = a.id_conteudo
     WHERE r.id_usuario = ?
     ORDER BY r.respondido_em DESC`,
    [idUsuario]
  );
  return rows;
}

/**
 * Obtém histórico de respostas para uma atividade
 */
async function obterHistoricoPorAtividade(idAtividade) {
  const [rows] = await pool.execute(
    `SELECT r.*, u.nome, u.email
     FROM respostas_usuario r
     JOIN usuarios u ON u.id_usuario = r.id_usuario
     WHERE r.id_atividade = ?
     ORDER BY r.respondido_em DESC`,
    [idAtividade]
  );
  return rows;
}

/**
 * Conta respostas corretas de um usuário
 */
async function contagemRespostasCorretas(idUsuario) {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as total FROM respostas_usuario WHERE id_usuario = ? AND correta = 1',
    [idUsuario]
  );
  return rows[0]?.total || 0;
}

/**
 * Calcula taxa de acerto de um usuário
 */
async function taxaAcertoUsuario(idUsuario) {
  const [rows] = await pool.execute(
    `SELECT 
       COUNT(*) as total,
       SUM(CASE WHEN correta = 1 THEN 1 ELSE 0 END) as corretas
     FROM respostas_usuario
     WHERE id_usuario = ?`,
    [idUsuario]
  );
  const result = rows[0];
  if (result.total === 0) return 0;
  return Math.round((result.corretas / result.total) * 100);
}

/**
 * Deleta resposta
 */
async function deletarResposta(idResposta) {
  await pool.execute(
    'DELETE FROM respostas_usuario WHERE id_resposta = ?',
    [idResposta]
  );
}

module.exports = {
  registrarResposta,
  obterHistoricoPorUsuario,
  obterHistoricoPorAtividade,
  contagemRespostasCorretas,
  taxaAcertoUsuario,
  deletarResposta
};