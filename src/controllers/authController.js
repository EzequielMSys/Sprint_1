const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [aluno, admin]
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     tipo:
 *                       type: string
 *       400:
 *         description: Campos obrigatórios faltando
 *       409:
 *         description: Email já cadastrado
 *       500:
 *         description: Erro interno
 */
async function registrar(req, res) {
  try {
    const { nome, email, senha, tipo } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }
    const usuarioExistente = await usuarioModel.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    const novoUsuario = await usuarioModel.criarUsuario({
      nome,
      email,
      senhaHash,
      tipo: tipo || 'aluno'
    });
    return res.status(201).json({
      message: 'Usuário criado com sucesso.',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        tipo: novoUsuario.tipo
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ message: 'Erro interno ao registrar usuário.' });
  }
}
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     tipo:
 *                       type: string
 *       400:
 *         description: Campos obrigatórios faltando
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno
 */
async function login(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }
    const usuario = await usuarioModel.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '8h' }
    );
    return res.json({
      message: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return res.status(500).json({ message: 'Erro interno ao autenticar.' });
  }
}
module.exports = {
  registrar,
  login
};