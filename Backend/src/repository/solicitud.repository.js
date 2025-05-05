import { SolicitudModel } from "../models";


export class SolicitudRepository {
    async crearSolicitud(data) {
        return await SolicitudModel.Solicitud.create(data);
    }

    async obtenerSolicitudPorId(id) {
        return await SolicitudModel.Solicitud.findByPk(id);
    }

    async obtenerSolicitudes() {
        return await SolicitudModel.Solicitud.findAll();
    }

    async actualizarSolicitud(id, data) {
        const solicitud = await SolicitudModel.Solicitud.findByPk(id);
        if (!solicitud) return null;
        await solicitud.update(data);
        return solicitud;
    }

    async eliminarSolicitud(id) {
        const solicitud = await SolicitudModel.Solicitud.findByPk(id);
        if (!solicitud) return null;
        await solicitud.destroy();
        return solicitud;
    }
}