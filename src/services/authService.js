const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');
const { gerarSenhaTemporaria, validarSenhaForte, sanitizeUser } = require('../utils/authUtils');
const jwt = require('jsonwebtoken');

class AuthService {
  async registrar(dados) {
    const { nome, email, tipo = 'aluno' } = dados;
    
    // Verifica se email já existe
    const usuarioExistente = await usuarioModel.buscarPorEmail(email);
    if (usuarioExistente) {
      throw new Error('Email já cadastrado');
    }

    // Gera senha temporária aleatória
    const senhaTemporaria = gerarSenhaTemporaria();
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const senhaHash = await bcrypt.hash(senhaTemporaria, saltRounds);

    // Cria usuário com senha temporária
    const novoUsuario = await usuarioModel.criarUsuario({
      nome,
      email,
      senhaHash,
      tipo,
      senha_temporaria: 1,
      ativo: 1
    });

    return {
      ...novoUsuario,
      senha_temporaria: senhaTemporaria // Retorna plana só para cadastro (admin vê)
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

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      throw new Error('Senha incorreta');
    }

    // Atualiza último login
    await usuarioModel.atualizarUltimoLogin(usuario.id);

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '8h' }
    );

    const { senha: _, senha_temporaria: __, ...usuarioSemSenha } = usuario;
    
    console.log('[DEBUG] Senha digitada:', senha ? senha.length + ' chars' : 'empty');
    console.log('[DEBUG] Senha banco existe:', !!usuario.senha);
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    console.log('[DEBUG] Senha match:', senhaCorreta);
    return {
      token,
      usuario: sanitizeUser(usuarioSemSenha),
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
    const usuario = await usuarioModel.buscarPorEmail(usuarioId); // temp fix
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Valida senha atual (temporária)
    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      throw new Error('Senha atual incorreta');
    }

    if (!validarSenhaForte(novaSenha)) {
      throw new Error('Senha deve ter min 8 chars, 1 maiúscula, 1 número');
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const novaSenhaHash = await bcrypt.hash(novaSenha, saltRounds);

    await usuarioModel.trocarSenha(usuarioId, novaSenhaHash, 0); // senha_temporaria = false

    return { message: 'Senha alterada com sucesso' };
  }

  async alterarSenha(usuarioId, senhaAtual, novaSenha) {
    const usuario = await usuarioModel.buscarPorEmail(usuarioId); // temp fix
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

