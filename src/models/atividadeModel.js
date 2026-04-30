const pool = require('../config/db');

/**
 * Cria uma nova atividade
 */
async function criarAtividade({ idConteudo, pergunta, tipo, respostaCorreta = null }) {
  const [result] = await pool.execute(
    `INSERT INTO atividades (id_conteudo, pergunta, tipo, resposta_correta)
     VALUES (?, ?, ?, ?)`,
    [idConteudo, pergunta, tipo, respostaCorreta]
  );
  return {
    id_atividade: result.insertId,
    id_conteudo: idConteudo,
    pergunta,
    tipo,
    resposta_correta: respostaCorreta
  };
}

/**
 * Lista atividades de um conteúdo
 */
async function listarPorConteudo(idConteudo) {
  const [rows] = await pool.execute(
    'SELECT * FROM atividades WHERE id_conteudo = ? ORDER BY id_atividade ASC',
    [idConteudo]
  );
  return rows;
}

/**
 * Obtém atividade por ID
 */
async function buscarPorId(idAtividade) {
  const [rows] = await pool.execute(
    'SELECT * FROM atividades WHERE id_atividade = ?',
    [idAtividade]
  );
  return rows[0];
}

/**
 * Atualiza atividade
 */
async function atualizarAtividade(idAtividade, dados) {
  const { pergunta, tipo, resposta_correta } = dados;
  await pool.execute(
    `UPDATE atividades
     SET pergunta = ?, tipo = ?, resposta_correta = ?
     WHERE id_atividade = ?`,
    [pergunta, tipo, resposta_correta || null, idAtividade]
  );
  return { id_atividade: idAtividade, ...dados };
}

/**
 * Deleta atividade
 */
async function deletarAtividade(idAtividade) {
  await pool.execute(
    'DELETE FROM atividades WHERE id_atividade = ?',
    [idAtividade]
  );
}

module.exports = {
  criarAtividade,
  listarPorConteudo,
  buscarPorId,
  atualizarAtividade,
  deletarAtividade
};