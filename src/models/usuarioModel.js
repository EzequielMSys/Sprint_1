const pool = require('../config/db');
async function criarUsuario({ nome, email, senhaHash, tipo = 'aluno' }) {
  const [result] = await pool.execute(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome, email, senhaHash, tipo]
  );
  return { id: result.insertId, nome, email, tipo };
}
async function buscarPorEmail(email) {
  const [rows] = await pool.execute(
    'SELECT * FROM usuarios WHERE email = ?',
    [email]
  );
  return rows[0];
}
async function buscarPorId(id) {
  const [rows] = await pool.execute(
    'SELECT id, nome, email, tipo, data_criacao FROM usuarios WHERE id = ?',
    [id]
  );
  return rows[0];
}
async function listarUsuarios() {
  const [rows] = await pool.execute(
    'SELECT id, nome, email, tipo, data_criacao FROM usuarios'
  );
  return rows;
}
module.exports = {
  criarUsuario,
  buscarPorEmail,
  buscarPorId,
  listarUsuarios
};