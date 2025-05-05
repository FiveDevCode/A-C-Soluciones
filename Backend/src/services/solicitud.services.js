import { SolicitudRepository } from "../repository/solicitud.repository";

export class SolicitudService {
    constructor() {
        this.solicitudRepository = new SolicitudRepository();
    }

    async crearSolicitud(data) {
        return await this.solicitudRepository.crearSolicitud(data);
    }

    async obtenerSolicitudPorId(id) {
        return await this.solicitudRepository.obtenerSolicitudPorId(id);
    }

    async obtenerSolicitudes() {
        return await this.solicitudRepository.obtenerSolicitudes();
    }

    async actualizarSolicitud(id, data) {
        return await this.solicitudRepository.actualizarSolicitud(id, data);
    }

    async eliminarSolicitud(id) {
        return await this.solicitudRepository.eliminarSolicitud(id);
    }
}