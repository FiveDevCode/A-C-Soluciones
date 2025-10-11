import { ContabilidadRepository } from '../repository/contabilidad.repository.js';

export class ContabilidadService {
    constructor() {
        this.contabilidadRepository = new ContabilidadRepository();
    }

    async crearContabilidad(data) {
        return await this.contabilidadRepository.crearContabilidad(data);
    }

    async obtenerContabilidadPorId(id) {
        return await this.contabilidadRepository.obtenerContabilidadPorId(id);
    }

    async obtenerContabilidadPorCedula(numero_de_cedula) {
        return await this.contabilidadRepository.obtenerContabilidadPorCedula(numero_de_cedula);
    }

    async obtenerContabilidadPorCorreo(correo_electronico) {
        return await this.contabilidadRepository.obtenerContabilidadPorCorreo(correo_electronico);
    }

    async obtenerContabilidads() {
        return await this.contabilidadRepository.obtenerContabilidads();
    }

    // falta el metodo de actualizar

    async eliminarContabilidad(id) {
        return await this.contabilidadRepository.eliminarContabilidad(id);
    }
}







