// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const cronogramaRoutes = require('./routes/cronogramaRoutes');
const atividadeRoutes = require('./routes/atividadeRoutes');
const redacaoRoutes = require('./routes/redacaoRoutes');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/cronograma', cronogramaRoutes);
app.use('/api/atividade', atividadeRoutes);
app.use('/api/redacao', redacaoRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'API Plataforma Estudos Inteligente OK' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});