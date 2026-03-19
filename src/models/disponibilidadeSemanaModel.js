const pool = require('../config/db');
async function salvarDisponibilidade(usuarioId, dias) {
  await pool.execute(
    'DELETE FROM disponibilidade_semana WHERE usuario_id = ?',
    [usuarioId]
  );
  const values = dias.map(d => [usuarioId, d.dia_semana, d.ocupado ? 1 : 0]);
  if (values.length > 0) {
    await pool.query(
      'INSERT INTO disponibilidade_semana (usuario_id, dia_semana, ocupado) VALUES ?',
      [values]
    );
  }
}
async function obterDisponibilidade(usuarioId) {
  const [rows] = await pool.execute(
    'SELECT * FROM disponibilidade_semana WHERE usuario_id = ?',
    [usuarioId]
  );
  return rows;
}
module.exports = {
  salvarDisponibilidade,
  obterDisponibilidade
};