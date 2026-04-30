const pool = require('../config/db');

/**
 * Atribui um conteúdo a um dia do cronograma
 */
async function atribuirConteudoAoDia(idDia, idConteudo = null) {
  const [result] = await pool.execute(
    `INSERT INTO cronograma_conteudos (id_dia, id_conteudo, concluido)
     VALUES (?, ?, 0)`,
    [idDia, idConteudo]
  );
  return {
    id: result.insertId,
    id_dia: idDia,
    id_conteudo: idConteudo,
    concluido: 0
  };
}

/**
 * Lista conteúdos de um dia
 */
async function listarConteudosPorDia(idDia) {
  const [rows] = await pool.execute(
    `SELECT cc.id, cc.id_dia, cc.id_conteudo, cc.concluido, c.*
     FROM cronograma_conteudos cc
     LEFT JOIN conteudos c ON c.id_conteudo = cc.id_conteudo
     WHERE cc.id_dia = ?
     ORDER BY cc.id ASC`,
    [idDia]
  );
  return rows;
}

/**
 * Marca conteúdo como concluído
 */
async function marcarConcluido(idConteudoCronograma) {
  await pool.execute(
    'UPDATE cronograma_conteudos SET concluido = 1 WHERE id = ?',
    [idConteudoCronograma]
  );
  return { id: idConteudoCronograma, concluido: 1 };
}

/**
 * Marca conteúdo como não concluído
 */
async function marcarNaoConcluido(idConteudoCronograma) {
  await pool.execute(
    'UPDATE cronograma_conteudos SET concluido = 0 WHERE id = ?',
    [idConteudoCronograma]
  );
  return { id: idConteudoCronograma, concluido: 0 };
}

/**
 * Marca todos os conteúdos de um dia como concluído
 */
async function marcarTodosConcluidos(idDia) {
  await pool.execute(
    'UPDATE cronograma_conteudos SET concluido = 1 WHERE id_dia = ?',
    [idDia]
  );
}

/**
 * Remove um conteúdo do cronograma
 */
async function removerConteudo(idConteudoCronograma) {
  await pool.execute(
    'DELETE FROM cronograma_conteudos WHERE id = ?',
    [idConteudoCronograma]
  );
}

/**
 * Remove todos os conteúdos de um dia
 */
async function removerConteudosDia(idDia) {
  await pool.execute(
    'DELETE FROM cronograma_conteudos WHERE id_dia = ?',
    [idDia]
  );
}

module.exports = {
  atribuirConteudoAoDia,
  listarConteudosPorDia,
  marcarConcluido,
  marcarNaoConcluido,
  marcarTodosConcluidos,
  removerConteudo,
  removerConteudosDia
};
