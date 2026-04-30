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
    const podeGerenciar = usuarioLogado.tipo === 'admin' || usuarioLogado.tipo === 'dono';

    if (tipo && !podeGerenciar) {
      throw new Error('Permissao negada para alterar tipo');
    }

    if (id != usuarioLogado.id && !podeGerenciar) {
      throw new Error('Permissao negada para editar outro usuario');
    }

    if (email && id == usuarioLogado.id) {
      const usuarioExistente = await usuarioModel.buscarPorEmail(email);
      if (usuarioExistente && usuarioExistente.id != id) {
        throw new Error('Email ja em uso');
      }
    }

    return await usuarioModel.atualizarUsuario(id, { nome, email, tipo });
  }

  async alterarTipo(id, tipo, usuarioLogado) {
    const podeGerenciar = usuarioLogado.tipo === 'admin' || usuarioLogado.tipo === 'dono';
    if (!podeGerenciar) {
      throw new Error('Permissao negada para alterar tipo');
    }
    return await usuarioModel.atualizarUsuario(id, { tipo });
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
