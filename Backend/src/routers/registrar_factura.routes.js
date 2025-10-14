import { RegistrarFacturasController } from '../controllers/registrar_facturas.controller.js';
import { Router } from 'express';
import { authenticate, isAdminOrContador} from '../middlewares/autenticacion.js';

const router = Router();
const registrarFacturasController = new RegistrarFacturasController(); 

router.post('/api/registrar-factura', authenticate, isAdminOrContador, registrarFacturasController.crearRegistroFactura);

router.get('/api/facturas', authenticate, isAdminOrContador, registrarFacturasController.obtenerRegistros);

router.get('/api/facturas-cliente/:id_cliente', authenticate, isAdminOrContador,registrarFacturasController.obtenerRegistroPorCliente);

router.get('/api/facturas-estado/:estado_factura', authenticate, isAdminOrContador, registrarFacturasController.obtenerPorEstado);
router.get('/api/facturas-saldo', authenticate, isAdminOrContador, registrarFacturasController.obtenerPorSaldoPendiente);

router.get('/api/factura-numero/:numero_factura', authenticate, isAdminOrContador, registrarFacturasController.obtenerRegistroPorNumero);
router.get('/api/factura/:id', authenticate, isAdminOrContador, registrarFacturasController.obtenerRegistroPorId);
router.put('/api/factura/:id', authenticate, isAdminOrContador, registrarFacturasController.actualizarRegistroFactura);
router.delete('/api/eliminar-factura/:id', authenticate, isAdminOrContador, registrarFacturasController.eliminarRegistroFactura);

export default router;