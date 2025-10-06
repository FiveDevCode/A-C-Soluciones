import { RegistrarFacturasController } from '../controllers/registrar_facturas.controller.js';
import { Router } from 'express';
import { authenticate, isAdmin} from '../middlewares/autenticacion.js';

const router = Router();
const registrarFacturasController = new RegistrarFacturasController(); 

router.post('/api/registrar-factura', authenticate, isAdmin, registrarFacturasController.crearRegistroFactura);

router.get('/api/facturas', authenticate, isAdmin, registrarFacturasController.obtenerRegistros);

router.get('/api/facturas-cliente/:id_cliente', authenticate, isAdmin,registrarFacturasController.obtenerRegistroPorCliente);

router.get('/api/facturas-estado/:estado_factura', authenticate, isAdmin, registrarFacturasController.obtenerPorEstado);
router.get('/api/facturas-saldo', authenticate, isAdmin, registrarFacturasController.obtenerPorSaldoPendiente);

router.get('/api/factura-numero/:numero_factura', authenticate, isAdmin, registrarFacturasController.obtenerRegistroPorNumero);
router.get('/api/factura/:id', authenticate, isAdmin, registrarFacturasController.obtenerRegistroPorId);
router.put('/api/factura/:id', authenticate, isAdmin, registrarFacturasController.actualizarRegistroFactura);
router.delete('/api/eliminar-factura/:id', authenticate, isAdmin, registrarFacturasController.eliminarRegistroFactura);

export default router;