import { RegistrarCuentasRepository } from "../repository/registrar_cuentas.repository.js";


export class RegistrarCuentasService {
    constructor() {
        this.registrarCuentasRepository = new RegistrarCuentasRepository();
    }

    async crearRegistroCuenta(data) {
        return await this.registrarCuentasRepository.crearRegistroCuenta(data);
    }

    async obtenerCuentaPorId(id_cliente) {
        return await this.registrarCuentasRepository.obtenerCuentaPorId(id_cliente);
    }

    async obtenerCuentaPorIdCuenta(id) {
        return await this.registrarCuentasRepository.obtenerCuentaPorIdCuenta(id);
    }

    async obtenerCuentaPorNumero(numero_cuenta) {
        return await this.registrarCuentasRepository.obtenerCuentaPorNumero(numero_cuenta);
    }

    async obtenerCuentaPorNit(nit) {
        return await this.registrarCuentasRepository.obtenerCuentaPorNit(nit);
    }

    async obtenerCuentas() {
        return await this.registrarCuentasRepository.obtenerCuentas();
    }

    async actualizarRegistroCuenta(id, data) {
        return await this.registrarCuentasRepository.actualizarRegistroCuenta(id, data);
    }

    async eliminarRegistroCuenta(id) {
        return await this.registrarCuentasRepository.eliminarRegistroCuenta(id);
    }  
}