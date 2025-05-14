import { SolicitudService } from '../services/solicitud.services.js';
import { ValidationError } from 'sequelize';

export class SolicitudController {
    constructor(servicio = new SolicitudService()) {
        this.solicitudService = servicio;
    }

    // Crear una nueva solicitud
    crear = async (req, res) => {
        try {
            const { cliente_id_fk, servicio_id_fk } = req.body;

            // Verificar existencia de cliente y servicio
            const clienteExiste = await this.solicitudService.clienteExiste(cliente_id_fk);
            const servicioExiste = await this.solicitudService.servicioExiste(servicio_id_fk);

            if (!clienteExiste || !servicioExiste) {
                return res.status(400).json({ 
                    message: 'Cliente o servicio no encontrado' 
                });
            }

            const nuevaSolicitud = await this.solicitudService.crear(req.body);
            return res.status(201).json(nuevaSolicitud);

        } catch (error) {
            console.error(error);

            if (error instanceof ValidationError) {
                const mensajes = error.errors.map(err => err.message);
                return res.status(400).json({ errors: mensajes });
            }

            return res.status(500).json({ message: 'Error al crear la solicitud' });
        }
    };

    // Obtener todas las solicitudes
    obtenerTodos = async (req, res) => {
        try {
            const solicitudes = await this.solicitudService.obtenerTodos();
            return res.status(200).json(solicitudes);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener las solicitudes' });
        }
    };

    // Obtener solicitud por ID
    obtenerPorId = async (req, res) => {
        try {
            const solicitud = await this.solicitudService.obtenerPorId(req.params.id);
            
            if (!solicitud) {
                return res.status(404).json({ message: 'Solicitud no encontrada' });
            }

            return res.status(200).json(solicitud);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener la solicitud' });
        }
    };

    // Obtener solicitudes por cliente
    obtenerPorCliente = async (req, res) => {
        try {
            const solicitudes = await this.solicitudService.obtenerPorCliente(req.params.cliente_id);
            
            if (!solicitudes || solicitudes.length === 0) {
                return res.status(404).json({ 
                    message: 'No se encontraron solicitudes para este cliente' 
                });
            }

            return res.status(200).json(solicitudes);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener las solicitudes' });
        }
    };

    // Actualizar estado de una solicitud
    actualizarEstado = async (req, res) => {
        try {
            const { estado } = req.body;
            const solicitudActualizada = await this.solicitudService.actualizarEstado(
                req.params.id, 
                estado
            );

            if (!solicitudActualizada) {
                return res.status(404).json({ message: 'Solicitud no encontrada' });
            }

            return res.status(200).json(solicitudActualizada);
        } catch (error) {
            console.error(error);
            
            if (error instanceof ValidationError) {
                const mensajes = error.errors.map(err => err.message);
                return res.status(400).json({ errors: mensajes });
            }

            return res.status(500).json({ message: 'Error al actualizar la solicitud' });
        }
    };

    // Eliminar una solicitud
    eliminar = async (req, res) => {
        try {
            const solicitudEliminada = await this.solicitudService.eliminar(req.params.id);
            
            if (!solicitudEliminada) {
                return res.status(404).json({ message: 'Solicitud no encontrada' });
            }

            return res.status(200).json({ message: 'Solicitud eliminada correctamente' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al eliminar la solicitud' });
        }
    };
}
