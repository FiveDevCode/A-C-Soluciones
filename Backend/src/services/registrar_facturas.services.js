import { RegistroFacturaRepository } from '../repository/registrar_facturas.repository.js';

export class RegistroFacturaService {
    constructor() {
        this.registroFacturaRepository = new RegistroFacturaRepository();
    }

    async crearRegistroFactura(data) {
        return await this.registroFacturaRepository.crearRegistroFactura(data);
    }

    async obtenerRegistroPorCliente(id_cliente) {
        return await this.registroFacturaRepository.obtenerRegistroPorCliente(id_cliente);
    }

    async obtenerRegistroPorId(id) {
        return await this.registroFacturaRepository.obtenerRegistroPorId(id);
    }

    async obtenerRegistros() {
        return await this.registroFacturaRepository.obtenerRegistros();
    }

    async obtenerRegistroPorNumero(numero_factura) {
        return await this.registroFacturaRepository.obtenerRegistroPorNumero(numero_factura);
    }

    async obtenerPorSaldoPendiente() {
        return await this.registroFacturaRepository.obtenerPorSaldoPendiente();
    }

    async obtenerPorEstado(estado_factura) {
        return await this.registroFacturaRepository.obtenerPorEstado(estado_factura);
    }

    async actualizarRegistroFactura(id, data) {
        return await this.registroFacturaRepository.actualizarRegistroFactura(id, data);
    }

    async eliminarRegistroFactura(id) {
        return await this.registroFacturaRepository.eliminarRegistroFactura(id);
    }
}
