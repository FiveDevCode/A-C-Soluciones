import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import expressOasGenerator from 'express-oas-generator';
import fs from 'fs';
import path from 'path';
import {dirname} from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import AministradorRouter from './routers/administrador.routes.js';
import TecnicoRouter from './routers/tecnico.routes.js';
import ClienteRouter from './routers/cliente.routes.js';
import UsuarioRouter from './routers/usuario.routes.js';
import ServicioRouter from "./routers/servicio.routes.js"
import SolicitudRouter from './routers/solicitud.routes.js';
import VisitaRouter from './routers/visita.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const App = express();

expressOasGenerator.init(App, {});

App.use(morgan('dev'));
App.use(express.json());

// configuracion de CORS
App.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

// ratas de la API
App.use(AministradorRouter)
App.use(TecnicoRouter);
App.use(ClienteRouter);
App.use(UsuarioRouter);
App.use(ServicioRouter); 
App.use(SolicitudRouter);
App.use(VisitaRouter);

// Documentación Swagger
const openApiPath = path.join(__dirname, '../openapi.json');
if (fs.existsSync(openApiPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(openApiPath, 'utf-8'));
  App.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}



export default App;