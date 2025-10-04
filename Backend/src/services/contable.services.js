import { ContableRepository } from "../repository/contable.repository";

export class ContableService {
    constructor() {
        this.contableRepository = new ContableRepository();
    }

    async crearContable(data) {
        return await this.contableRepository.crearContable(data);
    }

    async obtenerContablePorId(id) {
        return await this.contableRepository.obtenerContablePorId(id);
    }

    async obtenerContablePorcedula(numero_de_cedula){
        return await this.contableRepository.obtenerContablePorCedula(numero_de_cedula);
    }

    async obtenerContables() {
        return await this.contableRepository.obtenerContables();
    }

    async obtenerPorContableCorreo (correo_electronico){
        return await this.contableRepository.obtenerContablePorCorreo(correo_electronico)
    }

    async actualizarContable(id, data) {
        return await this.contableRepository.actualizarContable(id, data);
    }
}