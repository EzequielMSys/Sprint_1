const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');
const { gerarSenhaTemporaria } = require('../utils/authUtils');
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
    const usuario = await usuarioModel.buscarPorEmailCompleto(email);
    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }

    if (usuario.ativo === 0) {\n      const error = new Error('Usuário desativado');\n      error.status = 403;\n      throw error;\n    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      throw new Error('Credenciais inválidas');
    }

    // Atualiza último login
    await usuarioModel.atualizarUltimoLogin(usuario.id);

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '8h' }
    );

    const { senha, senha_temporaria: hashTemp, ...usuarioSemSenha } = usuario;
    
    console.log(`[LOGIN SUCCESS] ${email} - ${usuario.tipo} at ${new Date().toISOString()}`);\n    return {\n      token,\n      usuario: sanitizeUser(usuarioSemSenha),\n      primeiro_acesso: usuario.senha_temporaria === 1\n    };\n  }\n\n  async login(email, senha) {\n    try {\n      // ... existing logic\n    } catch (loginError) {\n      console.log(`[LOGIN FAIL] ${email} at ${new Date().toISOString()}: ${loginError.message}`);\n      throw loginError;\n    }\n  } 

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

    // Valida senha atual (temporária)
    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      throw new Error('Senha atual incorreta');
    }

    const { validarSenhaForte } = require('../utils/authUtils');\n    if (!validarSenhaForte(novaSenha)) {\n      throw new Error('Senha deve ter min 8 chars, 1 maiúscula, 1 número');\n    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const novaSenhaHash = await bcrypt.hash(novaSenha, saltRounds);

    await usuarioModel.trocarSenha(usuarioId, novaSenhaHash, 0); // senha_temporaria = false

    return { message: 'Senha alterada com sucesso' };
  }

async alterarSenha(usuarioId, senhaAtual, novaSenha) {\n    const usuario = await usuarioModel.buscarPorIdCompleto(usuarioId);\n    if (!usuario) {\n      throw new Error('Usuário não encontrado');\n    }\n\n    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);\n    if (!senhaCorreta) {\n      throw new Error('Senha atual incorreta');\n    }\n\n    const { validarSenhaForte } = require('../utils/authUtils');\n    if (!validarSenhaForte(novaSenha)) {\n      throw new Error('Senha deve ter min 8 chars, 1 maiúscula, 1 número');\n    }\n\n    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);\n    const novaSenhaHash = await bcrypt.hash(novaSenha, saltRounds);\n\n    await usuarioModel.alterarSenha(usuarioId, novaSenhaHash);\n\n    return { message: 'Senha alterada com sucesso' };\n  }\n}

module.exports = new AuthService();

