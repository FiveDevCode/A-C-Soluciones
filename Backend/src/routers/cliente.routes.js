import express from 'express';
import { ClienteController } from '../controllers/cliente.controller.js';

const router = express.Router();
const clienteController = new ClienteController();

// registrar clientes
router.post('/api/cliente', clienteController.crearCliente);
router.get('/api/cliente/todos', clienteController.obtenerTodosLosClientes);

// obtener todos los clientes registrados
router.get('/api/cliente', clienteController.obtenerClientesActivos);

// obtener cliente por id
router.get('/api/cliente/:id', clienteController.obtenerClientePorId);

// obtener cliente por cedula
router.get('/api/cliente/cedula/:numero_de_cedula', clienteController.obtenerClientePorCedula);

// obtener cliente por email
router.get('/api/cliente/email/:correo_electronico', clienteController.obtenerClientePorEmail);

//actualizar cliente por id
router.put('/api/cliente/:id', clienteController.actualizarCliente);

// eliminar cliente por id
router.delete('/api/cliente/:id', clienteController.eliminarCliente);


export default router;