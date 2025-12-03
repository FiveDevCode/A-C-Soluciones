import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import expressOasGenerator from 'express-oas-generator';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
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
import ContabilidadRouter from './routers/contabilidad.routes.js';
import RegistrarFacturas from './routers/registrar_factura.routes.js';
import RegistarCuentas from './routers/registrar_cuentas.routes.js';
import Inventario from './routers/inventario.routes.js';
import ChatbotRouter from './routers/chatbot.routes.js';
import HistorialServicesRoter from './routers/Historial_services.route.js';
import ReporteMantenimientoRouter from './routers/reporte_mantenimiento.routes.js';
import ReporteBombeoRouter from './routers/reporte_bombeo.routes.js'
import NotificacionRouter from './routers/notificacion.routes.js';
import { setupAssociations } from './models/asociaciones.midel.js';
import * as notificacionService from './services/notificacion.services.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const App = express();
setupAssociations();
expressOasGenerator.init(App, {});

App.use(morgan('dev'));
App.use(express.json());

App.use(cors({
 origin: function (origin, callback) {
    const allowedOrigins = [
     'https://a-c-soluciones.vercel.app',
     'capacitor://localhost',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS bloqueado para origen: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
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
App.use(ContabilidadRouter);
App.use(RegistrarFacturas);
App.use(RegistarCuentas);
App.use(Inventario);
App.use(ChatbotRouter);
App.use(HistorialServicesRoter);
App.use('/fichas', fichaClienteRouter);
App.use(ReporteBombeoRouter);
App.use(NotificacionRouter);

App.use('/fichas', express.static(path.resolve('uploads/fichas'))); // Cliente puede ver su PDF
App.use('/reportes', express.static(path.resolve('uploads/reportes'))); // Acceso a PDFs de reportes
App.use('/reportes_bombeo', express.static(path.resolve('uploads/reportes_bombeo'))); // Acceso a PDFs de reportes de bombeo
App.use('/api', fichaRouter);
App.use('/api', ReporteMantenimientoRouter);
// Documentación Swagger
const openApiPath = path.join(__dirname, '../openapi.json');
if (fs.existsSync(openApiPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(openApiPath, 'utf-8'));
  // documentacion de la API
  App.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
App.use(FaqRouter)

// Manejador de errores global - DEBE IR AL FINAL
App.use((err, req, res, next) => {
  console.error('Error en la aplicación:', err.message);
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Función para inicializar Socket.io
export const setupSocket = (io) => {
  notificacionService.inicializarSocket(io);
};

export default App;
