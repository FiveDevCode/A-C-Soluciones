import { SolicitudService } from '../services/solicitud.services.js';
import { ValidationError } from 'sequelize';
import * as notificacionService from '../services/notificacion.services.js';
import { ServicioModel } from '../models/servicios.model.js';
import emailService from '../services/correo.services.js';
import { ClienteModel } from '../models/cliente.model.js';

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
            
            // Obtener información del servicio para la notificación
            const servicio = await ServicioModel.Servicio.findByPk(servicio_id_fk);
            
            // Notificar al cliente sobre la solicitud creada
            if (servicio) {
                await notificacionService.notificarServicioSolicitado(
                    cliente_id_fk,
                    nuevaSolicitud.id,
                    servicio.nombre
                ).catch(err => console.error('Error al enviar notificación:', err));
            }
            
            return res.status(201).json(nuevaSolicitud);

        } catch (error) {
            console.error(error);

            if (error instanceof ValidationError) {
                // Mapear errores por campo para facilitar el manejo en el frontend
                const fieldErrors = {};
                error.errors.forEach(err => {
                    fieldErrors[err.path] = err.message;
                });
                return res.status(400).json({ errors: fieldErrors });
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
            const { estado, motivo_cancelacion } = req.body;
            
            // Validar que si el estado es rechazada, debe venir el motivo
            if (estado === 'rechazada' && !motivo_cancelacion) {
                return res.status(400).json({ 
                    message: 'Debes proporcionar un motivo para rechazar la solicitud' 
                });
            }
            
            // Obtener la solicitud antes de actualizarla para tener el estado anterior
            const solicitudAnterior = await this.solicitudService.obtenerPorId(req.params.id);
            
            if (!solicitudAnterior) {
                return res.status(404).json({ message: 'Solicitud no encontrada' });
            }

            const estadoAnterior = solicitudAnterior.estado;
            
            // Actualizar el estado con motivo si es cancelación
            const solicitudActualizada = await this.solicitudService.actualizarEstado(
                req.params.id, 
                estado,
                motivo_cancelacion
            );
            
            // Obtener información del cliente para enviar correo (en segundo plano)
            if (solicitudActualizada.cliente_id_fk) {
                // Ejecutar envío de notificaciones de forma no bloqueante
                setImmediate(async () => {
                    try {
                        console.log(`[DEBUG] Obteniendo cliente ID: ${solicitudActualizada.cliente_id_fk}`);
                        const cliente = await ClienteModel.Cliente.findByPk(solicitudActualizada.cliente_id_fk);
                        console.log(`[DEBUG] Cliente encontrado:`, cliente ? `${cliente.nombre} ${cliente.apellido} - ${cliente.correo_electronico}` : 'No encontrado');
                        
                        // Enviar notificación en la plataforma
                        await notificacionService.notificarCambioEstadoSolicitud(
                            solicitudActualizada.cliente_id_fk,
                            solicitudActualizada.id,
                            estado
                        ).catch(err => console.error('Error al enviar notificación en plataforma:', err));
                        
                        // Enviar correo electrónico
                        if (cliente && cliente.correo_electronico) {
                            const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`;
                            console.log(`[DEBUG] Intentando enviar correo a: ${cliente.correo_electronico}`);
                            console.log(`[DEBUG] Estado anterior: ${estadoAnterior}, Estado nuevo: ${estado}`);
                            
                            const resultadoCorreo = await emailService.enviarNotificacionCambioEstadoSolicitud(
                                cliente.correo_electronico,
                                nombreCompleto,
                                estadoAnterior,
                                estado,
                                solicitudActualizada.id,
                                motivo_cancelacion
                            );
                            
                            console.log(`[DEBUG] Resultado envío correo: ${resultadoCorreo ? 'ÉXITO' : 'FALLÓ'}`);
                            
                            if (resultadoCorreo) {
                                console.log(`✅ Correo enviado exitosamente a ${cliente.correo_electronico} - Estado cambiado de ${estadoAnterior} a ${estado}`);
                            } else {
                                console.error(`❌ No se pudo enviar el correo a ${cliente.correo_electronico}`);
                            }
                        } else {
                            console.warn(`[DEBUG] Cliente sin correo electrónico registrado`);
                        }
                    } catch (notifError) {
                        console.error('Error al enviar notificaciones:', notifError);
                        console.error('Stack trace:', notifError.stack);
                    }
                });
            } else {
                console.warn('[DEBUG] Solicitud sin cliente_id_fk');
            }

            // Responder inmediatamente sin esperar el envío de correos
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
