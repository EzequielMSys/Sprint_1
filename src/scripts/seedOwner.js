require('dotenv').config();
const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');

async function seedOwner() {
  try {
    const { OWNER_NAME, OWNER_EMAIL, OWNER_PASSWORD } = process.env;

    if (!OWNER_NAME || !OWNER_EMAIL || !OWNER_PASSWORD) {
      console.error('OWNER_NAME, OWNER_EMAIL e OWNER_PASSWORD sao obrigatorios no .env');
      process.exit(1);
    }

    const senhaForteRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!senhaForteRegex.test(OWNER_PASSWORD)) {
      console.error('OWNER_PASSWORD deve ter no minimo 8 caracteres, 1 maiuscula e 1 numero.');
      process.exit(1);
    }

    const existing = await usuarioModel.buscarPorEmail(OWNER_EMAIL);
    if (existing) {
      if (existing.tipo === 'dono') {
        console.log('Usuario dono ja existe:', existing.email);
      } else {
        console.warn('Email ja cadastrado com outro tipo:', existing.tipo);
      }
      process.exit(0);
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const senhaHash = await bcrypt.hash(OWNER_PASSWORD, saltRounds);

    await usuarioModel.criarUsuario({
      nome: OWNER_NAME,
      email: OWNER_EMAIL,
      senhaHash,
      tipo: 'dono',
      senha_temporaria: 0,
      ativo: 1
    });

    console.log('Usuario dono criado com sucesso:', OWNER_EMAIL);
    process.exit(0);
  } catch (error) {
    console.error('Erro ao seed dono:', error.message);
    process.exit(1);
  }
}

seedOwner();
