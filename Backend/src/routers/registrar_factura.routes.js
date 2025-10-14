import { RegistrarFacturasController } from '../controllers/registrar_facturas.controller.js';
import { Router } from 'express';
import { authenticate, isAdminOrContabilidad} from '../middlewares/autenticacion.js';

const router = Router();
const registrarFacturasController = new RegistrarFacturasController(); 

router.post('/api/registrar-factura', authenticate, isAdminOrContabilidad, registrarFacturasController.crearRegistroFactura);

router.get('/api/facturas', authenticate, isAdminOrContabilidad, registrarFacturasController.obtenerRegistros);

router.get('/api/facturas-cliente/:id_cliente', authenticate, isAdminOrContabilidad,registrarFacturasController.obtenerRegistroPorCliente);

router.get('/api/facturas-estado/:estado_factura', authenticate, isAdminOrContabilidad, registrarFacturasController.obtenerPorEstado);
router.get('/api/facturas-saldo', authenticate, isAdminOrContabilidad, registrarFacturasController.obtenerPorSaldoPendiente);

router.get('/api/factura-numero/:numero_factura', authenticate, isAdminOrContabilidad, registrarFacturasController.obtenerRegistroPorNumero);
router.get('/api/factura/:id', authenticate, isAdminOrContabilidad, registrarFacturasController.obtenerRegistroPorId);
router.put('/api/factura/:id', authenticate, isAdminOrContabilidad, registrarFacturasController.actualizarRegistroFactura);
router.delete('/api/eliminar-factura/:id', authenticate, isAdminOrContabilidad, registrarFacturasController.eliminarRegistroFactura);

export default router;