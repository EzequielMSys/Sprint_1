const pool = require('../config/db');
async function criarRedacao(usuarioId, { tema, texto, nota = null, feedback = null }) {
  const [result] = await pool.execute(
    `INSERT INTO redacoes (usuario_id, tema, texto, nota, feedback)
     VALUES (?, ?, ?, ?, ?)`,
    [usuarioId, tema, texto, nota, feedback]
  );
  return { id: result.insertId, usuario_id: usuarioId, tema, texto, nota, feedback };
}
async function listarPorUsuario(usuarioId) {
  const [rows] = await pool.execute(
    'SELECT * FROM redacoes WHERE usuario_id = ? ORDER BY criada_em DESC',
    [usuarioId]
  );
  return rows;
}
module.exports = {
  criarRedacao,
  listarPorUsuario
};