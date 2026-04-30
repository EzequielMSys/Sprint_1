const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Formato de token inválido.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: decoded.id, tipo: decoded.tipo };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

function isAdminOrDono(req, res, next) {
  if (req.usuario && (req.usuario.tipo === 'admin' || req.usuario.tipo === 'dono')) {
    return next();
  }
  return res.status(403).json({ message: 'Acesso restrito a administradores.' });
}

function isDono(req, res, next) {
  if (req.usuario && req.usuario.tipo === 'dono') {
    return next();
  }
  return res.status(403).json({ message: 'Acesso restrito ao dono do sistema.' });
}

module.exports = {
  authMiddleware,
  isAdminOrDono,
  isDono
};
