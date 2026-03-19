const pool = require('../config/db');
async function listarPorConteudo(conteudoId) {
  const [rows] = await pool.execute(
    'SELECT * FROM atividades WHERE conteudo_id = ?',
    [conteudoId]
  );
  return rows;
}
async function buscarPorId(id) {
  const [rows] = await pool.execute(
    'SELECT * FROM atividades WHERE id = ?',
    [id]
  );
  return rows[0];
}
module.exports = {
  listarPorConteudo,
  buscarPorId
};