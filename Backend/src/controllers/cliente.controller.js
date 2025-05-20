import { ClienteService } from "../services/cliente.services.js";
import { ValidationError } from 'sequelize'; 
import { camposPermitidosCliente } from '../services/allowedFields.js';



export class ClienteController {
constructor(clienteService = new ClienteService()) {
    this.clienteService = clienteService;
    this.actualizarMiPerfil = this.actualizarMiPerfil.bind(this);
}    crearCliente = async (req, res) => {
        try {
            const { numero_de_cedula } = req.body;
            const clienteExistente = await this.clienteService.obtenerClientePorCedula(numero_de_cedula);

            if (clienteExistente) {
                return res.status(400).json({ message: 'El cliente ya está registrado.' });
            }
            const nuevoCliente = await this.clienteService.crearCliente(req.body);
            return res.status(201).json(nuevoCliente);

        } catch (error) {
            console.error(error);

            if (error instanceof ValidationError) {
                const fieldErrors = {};
                error.errors.forEach((err) => {
                    if (err.path) {
                        fieldErrors[err.path] = err.message;
                    }
                });
                return res.status(400).json({ errors: fieldErrors });
            }
            return res.status(500).json({ message: 'Error al crear el cliente.' });
        }
    };
    obtenerClientePorId = async (req, res) => {
        try {
            const cliente = await this.clienteService.obtenerClientePorId(req.params.id);
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente no encontrado.' });
            }
            return res.status(200).json(cliente);
        } catch (error) {
            console.error(error);
            
            return res.status(500).json({ message: 'Error al obtener el cliente.' });
        }
    };
    obtenerClientePorCedula = async (req, res) => {
        try {
            const cliente = await this.clienteService.obtenerClientePorCedula(req.params.numero_de_cedula);
            
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }
            return res.status(200).json({ cliente });
        } catch (error) {
            console.error(error);
            
            return res.status(500).json({ message: 'Error al obtener el cliente.' });
        }
    };
    obtenerTodosLosClientes = async (req, res) => {
        try {
            const clientes = await this.clienteService.obtenerTodosLosClientes();
            return res.status(200).json(clientes);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener los clientes.' });
        }
    };  
    obtenerClientesActivos = async (req, res) => {
        try {
            const clientes = await this.clienteService.obtenerClientesActivos();
            return res.status(200).json(clientes);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener los clientes activos.' });
        }
    };
    actualizarCliente = async (req, res) => {
        try {
            const clienteActualizado = await this.clienteService.actualizarCliente(req.params.id, req.body);
            if (!clienteActualizado) {
                return res.status(404).json({ message: 'Cliente no encontrado.' });
            }
            return res.status(200).json(clienteActualizado);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al actualizar el cliente.' });
        }
    };
    eliminarCliente = async (req, res) => {
        try {
            const clienteEliminado = await this.clienteService.eliminarCliente(req.params.id);
            if (!clienteEliminado) {
                return res.status(404).json({ message: 'Cliente no encontrado.' });
            }
            return res.status(200).json(clienteEliminado);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al eliminar el cliente.' });
        }
    };
    obtenerClientePorEmail = async (req, res) => {
        try {
            const cliente = await this.clienteService.obtenerClientePorEmail(req.params.correo_electronico);
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente no encontrado.' });
            }
            return res.status(200).json(cliente);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener el cliente.' });
        }
    };


    

    actualizarMiPerfil = async (req, res) => {
        try {
            const clienteId = req.user.id;
            const dataFiltrada = {};

            camposPermitidosCliente.forEach((campo) => {
                if (campo in req.body) {
                    dataFiltrada[campo] = req.body[campo];
                }
            });

            const clienteActualizado = await this.clienteService.actualizarPerfilCliente(clienteId, dataFiltrada);

            if (!clienteActualizado) {
                return res.status(404).json({ message: 'Cliente no encontrado.' });
            }

            return res.status(200).json(clienteActualizado);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al actualizar el perfil del cliente.' });
         }
    };

}
