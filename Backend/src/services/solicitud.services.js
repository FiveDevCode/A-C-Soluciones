import { SolicitudRepository } from "../repository/solicitud.repository.js";

export class SolicitudService {
    constructor() {
        this.repository = new SolicitudRepository();
    }

    async crear(data) {
        return await this.repository.crear(data);
    }

    async obtenerTodos() {
        return await this.repository.obtenerTodos();
    }

    async obtenerPorId(id) {
        return await this.repository.obtenerPorId(id);
    }

    async obtenerPorCliente(cliente_id) {
        return await this.repository.obtenerPorCliente(cliente_id);
    }

    async clienteExiste(cliente_id) {
        return await this.repository.clienteExiste(cliente_id);
    }

    async servicioExiste(servicio_id) {
        return await this.repository.servicioExiste(servicio_id);
    }

    async actualizarEstado(id, estado, motivo_cancelacion = null) {
        const solicitud = await this.repository.actualizarEstado(id, estado, motivo_cancelacion);
        if (!solicitud) throw new Error('Solicitud no encontrada');
        return solicitud;
    }

    async eliminar(id) {
        return await this.repository.eliminar(id);
    }
}