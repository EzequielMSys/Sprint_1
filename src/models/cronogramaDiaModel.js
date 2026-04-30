const pool = require('../config/db');

/**
 * Cria um dia de estudo em um cronograma
 */
async function criarDia(idCronograma, { data_estudo, tempo_previsto = null }) {
  const [result] = await pool.execute(
    `INSERT INTO cronograma_dias (id_cronograma, data_estudo, tempo_previsto)
     VALUES (?, ?, ?)`,
    [idCronograma, data_estudo, tempo_previsto]
  );
  return {
    id_dia: result.insertId,
    id_cronograma: idCronograma,
    data_estudo,
    tempo_previsto
  };
}

/**
 * Lista dias de um cronograma
 */
async function listarDiasPorCronograma(idCronograma) {
  const [rows] = await pool.execute(
    'SELECT * FROM cronograma_dias WHERE id_cronograma = ? ORDER BY data_estudo ASC',
    [idCronograma]
  );
  return rows;
}

/**
 * Obtém um dia específico
 */
async function obterDiaId(idDia) {
  const [rows] = await pool.execute(
    'SELECT * FROM cronograma_dias WHERE id_dia = ?',
    [idDia]
  );
  return rows[0];
}

/**
 * Atualiza tempo previsto de um dia
 */
async function atualizarTempoPrevisto(idDia, tempoMinutos) {
  await pool.execute(
    'UPDATE cronograma_dias SET tempo_previsto = ? WHERE id_dia = ?',
    [tempoMinutos, idDia]
  );
  return { id_dia: idDia, tempo_previsto: tempoMinutos };
}

/**
 * Deleta um dia
 */
async function deletarDia(idDia) {
  await pool.execute(
    'DELETE FROM cronograma_dias WHERE id_dia = ?',
    [idDia]
  );
}

module.exports = {
  criarDia,
  listarDiasPorCronograma,
  obterDiaId,
  atualizarTempoPrevisto,
  deletarDia
};
