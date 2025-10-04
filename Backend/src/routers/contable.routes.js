import express  from 'express';
import { ContableController } from '../controllers/contable.controller.js';
import { authenticate, isAdmin} from '../middlewares/autenticacion.js';

const router = express.Router();
const contableController = new ContableController();

//crear contable
router.post('/api/contable',authenticate, isAdmin,  contableController.crearContable);
// obtener los contables registrados
router.get('/api/contable', authenticate, isAdmin, contableController.obtenerContables);
// obtener contable por id
router.get('/api/contable/:id', authenticate, isAdmin, contableController.obtenerTecnicoPorId);
// obtener contable por numero de cedula
router.get('/api/contable/cedula/:numero_de_cedula', authenticate, isAdmin, contableController.obtenerContablePorcedula);
// actualizar contable 
router.put('/api/contable/:id', authenticate, isAdmin, contableController.actualizarContable);

export default router;