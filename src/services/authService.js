const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');
const { gerarSenhaTemporaria, validarSenhaForte, sanitizeUser } = require('../utils/authUtils');
const jwt = require('jsonwebtoken');

class AuthService {
  async registrar(dados) {
    const { nome, email, tipo = 'aluno', senha } = dados;
    
    // Verifica se email já existe
    const usuarioExistente = await usuarioModel.buscarPorEmail(email);
    if (usuarioExistente) {
      throw new Error('Email já cadastrado');
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    let senhaHash;
    let isTemporaria = 1;
    let senhaRetorno;

    if (senha) {
      // Usuário forneceu própria senha — valida força
      if (!validarSenhaForte(senha)) {
        throw new Error('Senha deve ter min 8 chars, 1 maiúscula, 1 número');
      }
      senhaHash = await bcrypt.hash(senha, saltRounds);
      isTemporaria = 0;
      senhaRetorno = null;
    } else {
      // Gera senha temporária aleatória (backward compatible)
      senhaRetorno = gerarSenhaTemporaria();
      senhaHash = await bcrypt.hash(senhaRetorno, saltRounds);
    }

    // Cria usuário
    const novoUsuario = await usuarioModel.criarUsuario({
      nome,
      email,
      senhaHash,
      tipo,
      senha_temporaria: isTemporaria,
      ativo: 1
    });

    return {
      ...novoUsuario,
      senha_temporaria: senhaRetorno
    };
  }

  async login(email, senha) {
    const usuario = await usuarioModel.buscarPorEmail(email);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    if (usuario.ativo === 0) {
      const error = new Error('Usuário desativado');
      error.status = 403;
      throw error;
    }

    // DEBUG logs
    console.log('[LOGIN DEBUG] Email:', email);
    console.log('[LOGIN DEBUG] Senha length:', senha ? senha.length : 0);
    console.log('[LOGIN DEBUG] Hash length:', usuario.senha ? usuario.senha.length : 0);
    
    const bcryptMatch = await bcrypt.compare(senha, usuario.senha);
    console.log('[LOGIN DEBUG] bcrypt match:', bcryptMatch);
    
    if (!bcryptMatch) {
      throw new Error('Senha incorreta');
    }
    
    // Atualiza último login
    await usuarioModel.atualizarUltimoLogin(usuario.id);

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '8h' }
    );

    const safeUser = sanitizeUser(usuario);
    
    console.log('[LOGIN SUCCESS] User:', usuario.id);
    
    return {
      token,
      usuario: safeUser,
      primeiro_acesso: usuario.senha_temporaria === 1
    };
  }

  async esqueciSenha(email) {
    const usuario = await usuarioModel.buscarPorEmail(email);
    if (!usuario) {
      throw new Error('Email não encontrado');
    }

    const senhaTemporaria = gerarSenhaTemporaria();
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const senhaHash = await bcrypt.hash(senhaTemporaria, saltRounds);

    await usuarioModel.resetarSenhaTemporaria(usuario.id, senhaHash);

    return { senha_temporaria: senhaTemporaria };
  }

  async trocarSenhaPrimeiroAcesso(usuarioId, senhaAtual, novaSenha) {
    const usuario = await usuarioModel.buscarPorIdCompleto(usuarioId);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      throw new Error('Senha atual incorreta');
    }

    if (!validarSenhaForte(novaSenha)) {
      throw new Error('Senha deve ter min 8 chars, 1 maiúscula, 1 número');
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const novaSenhaHash = await bcrypt.hash(novaSenha, saltRounds);

    await usuarioModel.trocarSenha(usuarioId, novaSenhaHash);

    return { message: 'Senha alterada com sucesso' };
  }

  async alterarSenha(usuarioId, senhaAtual, novaSenha) {
    const usuario = await usuarioModel.buscarPorId(usuarioId);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      throw new Error('Senha atual incorreta');
    }

    if (!validarSenhaForte(novaSenha)) {
      throw new Error('Senha deve ter min 8 chars, 1 maiúscula, 1 número');
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const novaSenhaHash = await bcrypt.hash(novaSenha, saltRounds);

    await usuarioModel.alterarSenha(usuarioId, novaSenhaHash);

    return { message: 'Senha alterada com sucesso' };
  }
}

module.exports = new AuthService();

