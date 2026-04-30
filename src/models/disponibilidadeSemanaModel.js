const pool = require('../config/db');
const perfilModel = require('./perfilEstudoModel');

/**
 * Salva disponibilidade de uma semana para um perfil
 * Pode receber idPerfil ou usuarioId (para backward compatibility)
 * dias = [{dia_semana: 'segunda', hora_inicio: '08:00', hora_fim: '17:00', ocupado: 0}, ...]
 */
async function salvarDisponibilidade(idPerfilOrUsuarioId, dias) {
  let idPerfil = idPerfilOrUsuarioId;

  // Se recebeu usuarioId, obtém o perfil associado
  if (typeof idPerfilOrUsuarioId === 'string' || typeof idPerfilOrUsuarioId === 'number') {
    const perfil = await perfilModel.obterPerfilPorUsuario(idPerfilOrUsuarioId);
    if (perfil) {
      idPerfil = perfil.id_perfil;
    } else {
      throw new Error('Perfil não encontrado para o usuário');
    }
  }

  // Delete existing availability for this profile
  await pool.execute(
    'DELETE FROM disponibilidade_semana WHERE id_perfil = ?',
    [idPerfil]
  );

  if (!dias || dias.length === 0) return;

  // Insert new availability records
  const values = dias.map(d => [
    idPerfil,
    d.dia_semana,
    d.hora_inicio || '08:00:00',
    d.hora_fim || '18:00:00',
    d.ocupado ? 1 : 0
  ]);

  if (values.length > 0) {
    await pool.query(
      'INSERT INTO disponibilidade_semana (id_perfil, dia_semana, hora_inicio, hora_fim, ocupado) VALUES ?',
      [values]
    );
  }
}

/**
 * Obtém disponibilidade por ID (perfil ou usuário para backward compatibility)
 */
async function obterDisponibilidade(idPerfilOrUsuario) {
  // Tenta primeiro como ID de perfil
  let [rows] = await pool.execute(
    'SELECT * FROM disponibilidade_semana WHERE id_perfil = ? ORDER BY FIELD(dia_semana, "domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado")',
    [idPerfilOrUsuario]
  );

  // Se não encontrou, tenta como ID de usuário
  if (rows.length === 0) {
    [rows] = await pool.execute(
      `SELECT ds.* FROM disponibilidade_semana ds
       JOIN perfil_estudo pe ON ds.id_perfil = pe.id_perfil
       WHERE pe.id_usuario = ?
       ORDER BY FIELD(ds.dia_semana, "domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado")`,
      [idPerfilOrUsuario]
    );
  }

  return rows;
}

/**
 * Obtém disponibilidade por usuário (busca perfil primeiro)
 * Mantido para backward compatibility
 */
async function obterDisponibilidadePorUsuario(usuarioId) {
  const [rows] = await pool.execute(
    `SELECT ds.* FROM disponibilidade_semana ds
     JOIN perfil_estudo pe ON ds.id_perfil = pe.id_perfil
     WHERE pe.id_usuario = ?
     ORDER BY FIELD(ds.dia_semana, "domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado")`,
    [usuarioId]
  );
  return rows;
}

module.exports = {
  salvarDisponibilidade,
  obterDisponibilidade,
  obterDisponibilidadePorUsuario
};