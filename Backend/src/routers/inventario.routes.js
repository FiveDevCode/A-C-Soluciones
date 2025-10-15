import express from 'express';
import { InventarioController } from '../controllers/inventario.controller.js';
import { authenticate, isAdminOrContador, isAdminOrContadorOrTecnico}   from '../middlewares/autenticacion.js';



const router = express.Router();
const inventarioController = new InventarioController();


router.post('/api/inventario', authenticate, isAdminOrContador, inventarioController.crearInventario);


router.get('/api/inventario', authenticate, isAdminOrContadorOrTecnico, inventarioController.obtenerTodos);

router.get('/api/inventario/:id',authenticate, isAdminOrContadorOrTecnico, inventarioController.obtenerInventarioPorId);

router.put('/api/inventario/:id', authenticate, isAdminOrContador, inventarioController.actualizarInventario);

router.delete('/api/inventario/:id', authenticate, isAdminOrContador, inventarioController.eliminarInventario);




export default router;