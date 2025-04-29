import express from 'express';
import morgan from 'morgan';
import expressOasGenerator from 'express-oas-generator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

import TecnicoRouter from "./routers/tecnico.routes.js"
import clienteRouter from "./routers/cliente.routes.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const App = express();

expressOasGenerator.init(App, {});


App.use(morgan('dev'));
App.use(express.json());
App.use(TecnicoRouter);
App.use(clienteRouter);

// Documentación Swagger 
const openApiPath = path.join(__dirname, '../openapi.json');
if (fs.existsSync(openApiPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(openApiPath, 'utf-8'));
  // url para la documentacion de la api 
  App.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export default App;
