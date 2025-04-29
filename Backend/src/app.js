const express = require('express');
const morgan = require('morgan');
const expressOasGenerator = require('express-oas-generator');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url'); // Este puede eliminarse si no se usa import.meta.url
const swaggerUi = require('swagger-ui-express');

const TecnicoRouter = require('./routers/tecnico.routes.js');
const ClienteRouter = require('./routers/cliente.routes.js');


const App = express();

expressOasGenerator.init(App, {});

App.use(morgan('dev'));
App.use(express.json());
App.use(TecnicoRouter);
App.use(ClienteRouter);

// Documentación Swagger
const openApiPath = path.join(__dirname, '../openapi.json');
if (fs.existsSync(openApiPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(openApiPath, 'utf-8'));
  App.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = App;
