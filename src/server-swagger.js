// TEMP: Proposed updated server.js with Swagger UI (/api-docs, OpenAPI 3.0, scans src/**/*.js for JSDoc)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const cronogramaRoutes = require('./routes/cronogramaRoutes');
const atividadeRoutes = require('./routes/atividadeRoutes');
const redacaoRoutes = require('./routes/redacaoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Plataforma Estudos Inteligente API',
    version: '1.0.0',
    description: 'API para plataforma educacional inteligente (TCC)',
  },
  servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
  components: {
    securitySchemes: {
      BEARER_AUTH: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ BEARER_AUTH: [] }],
};

const specOptions = {
  swaggerDefinition,
  apis: ['./src/**/*.js'],
};

const specs = swaggerJsdoc(specOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve);
app.use('/api-docs', swaggerUi.setup(specs));

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/cronograma', cronogramaRoutes);
app.use('/api/atividade', atividadeRoutes);
app.use('/api/redacao', redacaoRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Plataforma Estudos Inteligente OK. Swagger UI: http://localhost:3000/api-docs' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger UI disponível em: http://localhost:${PORT}/api-docs`);
});

