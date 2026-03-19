const pool = require('../config/db');
async function registrarResposta(usuarioId, atividadeId, resposta, correto) {
  const [result] = await pool.execute(
    `INSERT INTO respostas_usuario (usuario_id, atividade_id, resposta, correto)
     VALUES (?, ?, ?, ?)`,
    [usuarioId, atividadeId, resposta, correto ? 1 : 0]
  );
  return { id: result.insertId, usuario_id: usuarioId, atividade_id: atividadeId, resposta, correto };
}
async function obterHistoricoPorUsuario(usuarioId) {
  const [rows] = await pool.execute(
    `SELECT r.*, a.pergunta
     FROM respostas_usuario r
     JOIN atividades a ON a.id = r.atividade_id
     WHERE r.usuario_id = ?
     ORDER BY r.respondido_em DESC`,
    [usuarioId]
  );
  return rows;
}
module.exports = {
  registrarResposta,
  obterHistoricoPorUsuario
};