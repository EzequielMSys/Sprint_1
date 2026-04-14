const authService = require('../services/authService');\n
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
async function registrar(req, res) {\n  try {\n    const { nome, email, tipo } = req.body;\n    if (!nome || !email) {\n      return res.status(400).json({ message: 'Nome e email são obrigatórios.' });\n    }\n\n    const resultado = await authService.registrar({ nome, email, tipo });\n\n    return res.status(201).json({\n      message: `Usuário criado. Senha temporária: ${resultado.senha_temporaria}. Informe ao usuário trocar no primeiro acesso.`,\n      usuario: {\n        id: resultado.id,\n        nome: resultado.nome,\n        email: resultado.email,\n        tipo: resultado.tipo\n      }\n    });\n  } catch (error) {\n    console.error('Erro ao registrar usuário:', error);\n    if (error.message === 'Email já cadastrado') {\n      return res.status(409).json({ message: error.message });\n    }\n    return res.status(500).json({ message: 'Erro interno ao registrar usuário.' });\n  }\n}
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
async function login(req, res) {\n  try {\n    const { email, senha } = req.body;\n    if (!email || !senha) {\n      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });\n    }\n\n    const resultado = await authService.login(email, senha);\n\n    return res.json({\n      message: 'Login realizado com sucesso.',\n      ...resultado\n    });\n  } catch (error) {\n    console.error('Erro ao autenticar usuário:', error);\n    if (error.message === 'Credenciais inválidas' || error.message === 'Usuário inativo') {\n      return res.status(401).json({ message: error.message });\n    }\n    return res.status(500).json({ message: 'Erro interno ao autenticar.' });\n  }\n}
module.exports = {\n  registrar,\n  login,\n  ...require('./novaAuthController')\n};

