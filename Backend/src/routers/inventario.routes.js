import express from 'express';
import { InventarioController } from '../controllers/inventario.controller.js';



const router = express.Router();
const inventarioController = new InventarioController();


router.post('/api/inventario', inventarioController.crearInventario);


router.get('/api/inventario', inventarioController.obtenerTodos);

router.get('/api/inventario/:id', inventarioController.obtenerInventarioPorId);

router.put('/api/inventario/:id', inventarioController.actualizarInventario);

router.delete('/api/inventario/:id', inventarioController.eliminarInventario);




export default router;