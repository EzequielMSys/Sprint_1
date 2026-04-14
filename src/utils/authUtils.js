const crypto = require('crypto');

/**
 * Gera senha temporária aleatória de 8 caracteres (maiúsculas + números)
 */
function gerarSenhaTemporaria() {
  return crypto.randomBytes(4)
    .toString('hex')
    .toUpperCase()
    .slice(0, 8);
}

/**
 * Valida se senha atende critérios de força
 * Mín 8 chars, 1 maiúscula, 1 número
 */
function validarSenhaForte(senha) {
  const regex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return regex.test(senha);
}

function sanitizeUser(usuario) {\n  const { senha, senha_temporaria, token_recuperacao, token_expiracao, ...safe } = usuario;\n  return safe;\n}\n\nmodule.exports = {\n  gerarSenhaTemporaria,\n  validarSenhaForte,\n  sanitizeUser\n};

