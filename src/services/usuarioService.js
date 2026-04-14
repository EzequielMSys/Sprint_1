const usuarioModel = require('../models/usuarioModel');
const { gerarSenhaTemporaria } = require('../utils/authUtils');
const bcrypt = require('bcrypt');

class UsuarioService {
  async listar() {
    return await usuarioModel.listarUsuarios();
  }

  async obterPorId(id) {
    return await usuarioModel.buscarPorId(id);
  }

  async obterPerfilLogado(id) {
    return await usuarioModel.buscarPorId(id);
  }

  async atualizar(id, dados, usuarioLogado) {
    const { nome, email, tipo } = dados;

    // Só admin pode alterar tipo de outros usuários
    if (id != usuarioLogado.id && (!usuarioLogado.isAdmin || tipo)) {
      throw new Error('Permissão negada para alterar tipo');
    }

    // Se alterando email próprio, verifica unicidade
    if (email && id == usuarioLogado.id) {
      const usuarioExistente = await usuarioModel.buscarPorEmail(email);
      if (usuarioExistente && usuarioExistente.id != id) {
        throw new Error('Email já em uso');
      }
    }

    return await usuarioModel.atualizarUsuario(id, { nome, email, tipo });
  }

  async ativarDesativar(id, ativo) {
    return await usuarioModel.ativarDesativarUsuario(id, ativo);
  }

  async resetarSenha(id) {
    const senhaTemporaria = gerarSenhaTemporaria();
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const senhaHash = await bcrypt.hash(senhaTemporaria, saltRounds);

    await usuarioModel.resetarSenhaTemporaria(id, senhaHash);

    return { senha_temporaria: senhaTemporaria };
  }
}

module.exports = new UsuarioService();

