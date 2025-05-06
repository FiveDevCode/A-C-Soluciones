import { SolicitudService } from "../services/solicitud.services.js";
import { ValidationError } from "sequelize";

export class SolicitudController {
    constructor() {
        this.solicitudService = new SolicitudService();
    }

    // Crear una nueva solicitud
    crearSolicitud = async (req, res) => {
        try {
            const { 
                fecha_solicitud, 
                direccion_servicio, 
                comentarios, 
                servicio_id_fk, 
                cliente_id_fk 
            } = req.body;

            // Validar que exista el cliente
            const clienteExiste = await this.solicitudService.verificarCliente(cliente_id_fk);
            if (!clienteExiste) {
                return res.status(404).json({
                    success: false,
                    message: 'El cliente especificado no existe'
                });
            }

            // Validar que exista el servicio
            const servicioExiste = await this.solicitudService.verificarServicio(servicio_id_fk);
            if (!servicioExiste) {
                return res.status(404).json({
                    success: false,
                    message: 'El servicio especificado no existe'
                });
            }

            // Crear la solicitud
            const nuevaSolicitud = await this.solicitudService.crearSolicitud({
                fecha_solicitud,
                direccion_servicio,
                comentarios,
                servicio_id_fk,
                cliente_id_fk,
                estado: 'pendiente' // Por defecto
            });

            return res.status(201).json({
                success: true,
                message: 'Solicitud creada exitosamente',
                data: nuevaSolicitud
            });
        } catch (error) {
            console.error('Error al crear solicitud:', error);
            
            if (error instanceof ValidationError) {
                return res.status(400).json({
                    success: false,
                    message: 'Error de validación',
                    errors: error.errors.map(e => e.message)
                });
            }
            
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al crear la solicitud'
            });
        }
    }

    // Obtener todas las solicitudes
    obtenerSolicitudes = async (req, res) => {
        try {
            const solicitudes = await this.solicitudService.obtenerSolicitudes();
            
            return res.status(200).json({
                success: true,
                data: solicitudes
            });
        } catch (error) {
            console.error('Error al obtener solicitudes:', error);
            
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al obtener las solicitudes'
            });
        }
    }

    // Obtener solicitudes por cliente
    obtenerSolicitudesPorCliente = async (req, res) => {
        try {
            const { cliente_id_fk } = req.params;
            
            const solicitudes = await this.solicitudService.obtenerSolicitudesPorCliente(cliente_id_fk);
            
            return res.status(200).json({
                success: true,
                data: solicitudes
            });
        } catch (error) {
            console.error('Error al obtener solicitudes por cliente:', error);
            
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al obtener las solicitudes por cliente'
            });
        }
    }

    // Obtener una solicitud por ID
    obtenerSolicitudPorId = async (req, res) => {
        try {
            const { id } = req.params;
            
            const solicitud = await this.solicitudService.obtenerSolicitudPorId(id);
            
            if (!solicitud) {
                return res.status(404).json({
                    success: false,
                    message: 'Solicitud no encontrada'
                });
            }
            
            return res.status(200).json({
                success: true,
                data: solicitud
            });
        } catch (error) {
            console.error('Error al obtener solicitud por ID:', error);
            
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al obtener la solicitud'
            });
        }
    }

    // Actualizar el estado de una solicitud
    actualizarEstadoSolicitud = async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            
            // Validar el estado
            const estadosValidos = ['pendiente', 'cotizada', 'aceptada', 'en proceso', 'completada', 'cancelada'];
            
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado de solicitud no válido',
                    estadosValidos
                });
            }if (estado = 'completada'){
                return res.status(400).json({
                    success:false,
                    message: 'No se puede modificar una solicitud completada'                })
            }
            
            try {
                const solicitudActualizada = await this.solicitudService.actualizarEstadoSolicitud(id, estado);
                
                return res.status(200).json({
                    success: true,
                    message: 'Estado de solicitud actualizado exitosamente',
                    data: solicitudActualizada
                });
            } catch (error) {
                if (error.message === 'Solicitud no encontrada') {
                    return res.status(404).json({
                        success: false,
                        message: 'Solicitud no encontrada'
                    });
                }
                throw error;
            }
        } catch (error) {
            console.error('Error al actualizar estado de solicitud:', error);
            
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al actualizar el estado de la solicitud'
            });
        }
    }
    //Eliminar una solicitud
    eliminarSolicitud = async (req, res) => {
        try {
            const { id } = req.params;
            
            const solicitudEliminada = await this.solicitudService.eliminarSolicitud(id);
            
            if (!solicitudEliminada) {
                return res.status(404).json({
                    success: false,
                    message: 'Solicitud no encontrada'
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'Solicitud eliminada exitosamente',
                data: solicitudEliminada
            });
        } catch (error) {
            console.error('Error al eliminar solicitud:', error);
            
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor al eliminar la solicitud'
            });
        }
    }
}