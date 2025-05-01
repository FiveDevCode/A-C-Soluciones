import express from 'express';
import { TecnicoController } from '../controllers/tecnico.controller.js';

const router = express.Router();
const tecnicoController = new TecnicoController();

// registrar empleados 
router.post('/api/tecnico',  tecnicoController.crearTecnico);

// obtener todo los empleados registrados 
router.get('/api/tecnico', tecnicoController.obtenerTecnicos);

// obtener empleado por id
router.get('/api/tecnico/:id', tecnicoController.obtenerTecnicoPorId);

// obtener empleado por numero de cedula 
router.get('/api/tecnico/cedula/:numero_de_cedula', tecnicoController.obtenerTecnicoPorCedula);

// actualizar empleado por id
router.put('/api/tecnico/:id', tecnicoController.actualizarTecnico);

// eliminar empleado por id
router.delete('/api/tecnico/:id', tecnicoController.eliminarTecnico);

export default router;


