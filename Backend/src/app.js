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
import fichaRouter from './routers/ficha.routes.js';
import fichaClienteRouter from './routers/ficha.routes.js'; 
import FaqRouter from './routers/preguntas_frecuentes.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const App = express();

expressOasGenerator.init(App, {});

App.use(morgan('dev'));
App.use(express.json());

// configuracion de CORS
//App.use(cors({
//  origin: [
//    '*',
//    'https://a-c-soluciones.vercel.app'
//  ],
//  credentials: true
//}));

//App.use(cors({
// origin: function (origin, callback) {
//    const allowedOrigins = [
//     'https://a-c-soluciones.vercel.app',
//      'http://localhost:3000',
//      'http://127.0.0.1:3000'
//    ];
//
//    if (!origin || allowedOrigins.includes(origin)) {
//      callback(null, true);
//    } else {
//      console.warn(`❌ CORS bloqueado para origen: ${origin}`);
//      callback(new Error('Not allowed by CORS'));
//    }
//  },
//  credentials: true
//}));

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://a-c-soluciones.vercel.app',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];

    // Si no hay origin (por ejemplo, app móvil Flutter), permitir
    if (!origin) {
      return callback(null, true);
    }

    // Permitir si coincide con los orígenes definidos
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`❌ CORS bloqueado para origen: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));



// rutas de la API
App.use(AministradorRouter)
App.use(TecnicoRouter);
App.use(ClienteRouter);
App.use(UsuarioRouter);
App.use(ServicioRouter); 
App.use(SolicitudRouter);
App.use(VisitaRouter);
App.use('/fichas', fichaClienteRouter);

App.use('/fichas', express.static(path.resolve('uploads/fichas'))); // Cliente puede ver su PDF
App.use('/api', fichaRouter);
// Documentación Swagger
const openApiPath = path.join(__dirname, '../openapi.json');
if (fs.existsSync(openApiPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(openApiPath, 'utf-8'));
  App.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
App.use(FaqRouter)



export default App;
