
import { SolicitudRepository } from "../repository/solicitud.repository.js";

export class SolicitudService {
    constructor() {
        this.solicitudRepository = new SolicitudRepository();
    }

    // Verificar si existe un cliente
    async verificarCliente(clienteId) {
        try {
            return await this.solicitudRepository.clienteExiste(clienteId);
        } catch (error) {
            console.error("Error en servicio al verificar cliente:", error);
            throw error;
        }
    }

    // Verificar si existe un servicio
    async verificarServicio(servicioId) {
        try {
            return await this.solicitudRepository.servicioExiste(servicioId);
        } catch (error) {
            console.error("Error en servicio al verificar servicio:", error);
            throw error;
        }
    }

    // Crear una nueva solicitud
    async crearSolicitud(solicitudData) {
        try {
            return await this.solicitudRepository.crear(solicitudData);
        } catch (error) {
            console.error("Error en servicio al crear solicitud:", error);
            throw error;
        }
    }

    // Obtener todas las solicitudes con sus relaciones
    async obtenerSolicitudes() {
        try {
            return await this.solicitudRepository.obtenerTodos();
        } catch (error) {
            console.error("Error en servicio al obtener solicitudes:", error);
            throw error;
        }
    }

    // Obtener solicitudes por cliente
    async obtenerSolicitudesPorCliente(clienteId) {
        try {
            return await this.solicitudRepository.obtenerPorCliente(clienteId);
        } catch (error) {
            console.error("Error en servicio al obtener solicitudes por cliente:", error);
            throw error;
        }
    }

    // Obtener una solicitud por ID
    async obtenerSolicitudPorId(id) {
        try {
            return await this.solicitudRepository.obtenerPorId(id);
        } catch (error) {
            console.error("Error en servicio al obtener solicitud por ID:", error);
            throw error;
        }
    }

    // Actualizar el estado de una solicitud
    async actualizarEstadoSolicitud(id, estado) {
        try {
            const solicitud = await this.solicitudRepository.actualizarEstado(id, estado);
            
            if (!solicitud) {
                throw new Error('Solicitud no encontrada');
            }
            
            return solicitud;
        } catch (error) {
            console.error("Error en servicio al actualizar estado de solicitud:", error);
            throw error;
        }
    }
    //Eliminar una solicitud
    async eliminarSolicitud(id) {
        try {
            return await this.solicitudRepository.eliminar(id);
        } catch (error) {
            console.error("Error en servicio al eliminar solicitud:", error);
            throw error;
        }
    }
}