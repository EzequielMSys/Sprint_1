const pool = require('../config/db');
async function criarCronograma(usuarioId, { titulo, data_inicio, data_fim }) {
  const [result] = await pool.execute(
    `INSERT INTO cronogramas (usuario_id, titulo, data_inicio, data_fim)
     VALUES (?, ?, ?, ?)`,
    [usuarioId, titulo, data_inicio, data_fim]
  );
  return { id: result.insertId, usuario_id: usuarioId, titulo, data_inicio, data_fim };
}
async function listarCronogramasPorUsuario(usuarioId) {
  const [rows] = await pool.execute(
    'SELECT * FROM cronogramas WHERE usuario_id = ? ORDER BY criado_em DESC',
    [usuarioId]
  );
  return rows;
}
async function criarDia(cronogramaId, data_estudo) {
  const [result] = await pool.execute(
    'INSERT INTO cronograma_dias (cronograma_id, data_estudo) VALUES (?, ?)',
    [cronogramaId, data_estudo]
  );
  return { id: result.insertId, cronograma_id: cronogramaId, data_estudo };
}
async function atribuirConteudoAoDia(diaId, conteudoId) {
  const [result] = await pool.execute(
    'INSERT INTO cronograma_conteudos (dia_id, conteudo_id) VALUES (?, ?)',
    [diaId, conteudoId]
  );
  return { id: result.insertId, dia_id: diaId, conteudo_id: conteudoId };
}
async function obterCronogramaCompleto(usuarioId) {
  const [cronogramas] = await pool.execute(
    'SELECT * FROM cronogramas WHERE usuario_id = ? ORDER BY criado_em DESC',
    [usuarioId]
  );
  if (cronogramas.length === 0) return null;
  const cronograma = cronogramas[0];
  const [dias] = await pool.execute(
    'SELECT * FROM cronograma_dias WHERE cronograma_id = ? ORDER BY data_estudo ASC',
    [cronograma.id]
  );
  for (const dia of dias) {
    const [conteudos] = await pool.execute(
      `SELECT cc.id, cc.concluido, c.*
       FROM cronograma_conteudos cc
       JOIN conteudos c ON c.id = cc.conteudo_id
       WHERE cc.dia_id = ?`,
      [dia.id]
    );
    dia.conteudos = conteudos;
  }
  cronograma.dias = dias;
  return cronograma;
}
module.exports = {
  criarCronograma,
  listarCronogramasPorUsuario,
  criarDia,
  atribuirConteudoAoDia,
  obterCronogramaCompleto
};