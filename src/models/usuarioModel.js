const pool = require('../config/db');

/**
 * Cria novo usuário com campos expandidos
 */
async function criarUsuario({ nome, email, senhaHash, tipo = 'aluno', senha_temporaria = 1, ativo = 1 }) {
  const [result] = await pool.execute(
    `INSERT INTO usuarios (nome, email, senha, tipo, senha_temporaria, ativo) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nome, email, senhaHash, tipo, senha_temporaria, ativo]
  );
  return { 
    id: result.insertId, 
    nome, 
    email, 
    tipo,
    senha_temporaria,
    ativo 
  };
}

/**
 * Busca por email com todos os campos (para auth)
 */
async function buscarPorEmail(email) {
  const [rows] = await pool.execute(
    `SELECT id, nome, email, senha, tipo, ativo, senha_temporaria, ultimo_login 
     FROM usuarios WHERE email = ?`,
    [email]
  );
  return rows[0];
}

/**
 * Busca por email básica (sem senha)
 */
async function buscarPorEmailSimples(email) {
  const [rows] = await pool.execute(
    'SELECT id, nome, email, tipo, data_criacao FROM usuarios WHERE email = ?',
    [email]
  );
  return rows[0];
}

/**
 * Busca completa por ID (com novos campos)
 */
async function buscarPorIdCompleto(id) {
  const [rows] = await pool.execute(
    `SELECT id, nome, email, senha, tipo, data_criacao, ativo, senha_temporaria, 
            ultimo_login, atualizado_em 
     FROM usuarios WHERE id = ?`,
    [id]
  );
  return rows[0];
}

/**
 * Busca pública por ID (sem senha)
 */
async function buscarPorId(id) {
  const [rows] = await pool.execute(
    'SELECT id, nome, email, tipo, data_criacao FROM usuarios WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function listarUsuarios() {
  const [rows] = await pool.execute(
    `SELECT id, nome, email, tipo, data_criacao, ativo, senha_temporaria, 
            ultimo_login, atualizado_em 
     FROM usuarios ORDER BY nome`
  );
  return rows;
}

/**
 * Atualiza dados do usuário
 */
async function atualizarUsuario(id, dados) {
  const { nome, email, tipo } = dados;
  const [result] = await pool.execute(
    `UPDATE usuarios 
     SET nome = ?, email = ?, tipo = ?, atualizado_em = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [nome, email, tipo, id]
  );
  return { id, ...dados };
}

/**
 * Ativa/desativa usuário
 */
async function ativarDesativarUsuario(id, ativo) {
  const [result] = await pool.execute(
    `UPDATE usuarios SET ativo = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?`,
    [ativo, id]
  );
  return { id, ativo };
}

/**
 * Atualiza último login
 */
async function atualizarUltimoLogin(id) {
  await pool.execute(
    'UPDATE usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
}

/**
 * Reseta para senha temporária
 */
async function resetarSenhaTemporaria(id, senhaHash) {
  await pool.execute(
    `UPDATE usuarios 
     SET senha = ?, senha_temporaria = 1, token_recuperacao = NULL, 
         token_expiracao = NULL, atualizado_em = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [senhaHash, id]
  );
}

/**
 * Troca senha e desabilita temporária
 */
async function trocarSenha(id, senhaHash) {
  await pool.execute(
    `UPDATE usuarios 
     SET senha = ?, senha_temporaria = 0, atualizado_em = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [senhaHash, id]
  );
}

/**
 * Altera qualquer senha
 */
async function alterarSenha(id, senhaHash) {
  await pool.execute(
    `UPDATE usuarios 
     SET senha = ?, atualizado_em = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [senhaHash, id]
  );
}

module.exports = {
  criarUsuario,
  buscarPorEmail,
  buscarPorEmailSimples,
  buscarPorId,
  buscarPorIdCompleto,
  listarUsuarios,
  atualizarUsuario,
  ativarDesativarUsuario,
  atualizarUltimoLogin,
  resetarSenhaTemporaria,
  trocarSenha,
  alterarSenha
};

