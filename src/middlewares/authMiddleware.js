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
function isAdmin(req, res, next) {
  if (req.usuario && req.usuario.tipo === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Acesso restrito a administradores.' });
}
module.exports = {
  authMiddleware,
  isAdmin
};
