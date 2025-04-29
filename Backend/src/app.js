import express from 'express';
import morgan from 'morgan';
import expressOasGenerator from 'express-oas-generator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

import usuarioRouter from './routers/usuario.routes.js'; 
import { sequelize } from './database/conexion.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); 

// Configuración inicial
expressOasGenerator.init(app, {});

// Middlewares básicos
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares de seguridad 
import { configurarCORS, headersSeguridad } from './middlewares/autenticacion.js';
app.use(configurarCORS);
app.use(headersSeguridad);

// Rutas
app.use('/api/auth', usuarioRouter); // Rutas de autenticación

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    database: sequelize.authenticate() ? 'Connected' : 'Disconnected'
  });
});

// Documentación Swagger
const openApiPath = path.join(__dirname, '../openapi.json');
if (fs.existsSync(openApiPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(openApiPath, 'utf-8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});


export default app;