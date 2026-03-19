const pool = require('../config/db');
async function criarOuAtualizarPerfil(usuarioId, perfil) {
  const {
    ano_escolar,
    processo_seletivo,
    area_foco,
    horas_diarias,
    tempo_objetivo
  } = perfil;
  const [rows] = await pool.execute(
    'SELECT id FROM perfil_estudo WHERE usuario_id = ?',
    [usuarioId]
  );
  if (rows.length > 0) {
    const id = rows[0].id;
    await pool.execute(
      `UPDATE perfil_estudo
       SET ano_escolar = ?, processo_seletivo = ?, area_foco = ?, horas_diarias = ?, tempo_objetivo = ?
       WHERE id = ?`,
      [ano_escolar, processo_seletivo, area_foco, horas_diarias, tempo_objetivo, id]
    );
    return { id, usuario_id: usuarioId, ...perfil };
  } else {
    const [result] = await pool.execute(
      `INSERT INTO perfil_estudo
       (usuario_id, ano_escolar, processo_seletivo, area_foco, horas_diarias, tempo_objetivo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [usuarioId, ano_escolar, processo_seletivo, area_foco, horas_diarias, tempo_objetivo]
    );
    return { id: result.insertId, usuario_id: usuarioId, ...perfil };
  }
}
async function obterPerfilPorUsuario(usuarioId) {
  const [rows] = await pool.execute(
    'SELECT * FROM perfil_estudo WHERE usuario_id = ?',
    [usuarioId]
  );
  return rows[0];
}
module.exports = {
  criarOuAtualizarPerfil,
  obterPerfilPorUsuario
};
