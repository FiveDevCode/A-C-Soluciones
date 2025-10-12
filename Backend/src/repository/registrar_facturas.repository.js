import { RegistroFacturaModel } from "../models/registrar_facturas.model.js";
import { Op } from "sequelize";

export class RegistroFacturaRepository {
    async crearRegistroFactura(data) {
        return await RegistroFacturaModel.RegistroFactura.create(data);
    }

    async obtenerRegistroPorCliente(id_cliente) {
        return await RegistroFacturaModel.RegistroFactura.findAll({
            where: { id_cliente },
        });
    }
    async obtenerRegistroPorId(id) {
        return await RegistroFacturaModel.RegistroFactura.findByPk(id);
    }
    async obtenerRegistros() {
        return await RegistroFacturaModel.RegistroFactura.findAll();
    }
    async obtenerRegistroPorNumero(numero_factura) {
        return await RegistroFacturaModel.RegistroFactura.findOne({
            where: { numero_factura },
        });
    }
    async obtenerPorSaldoPendiente() {
        return await RegistroFacturaModel.RegistroFactura.findAll({
           where: {
            saldo_pendiente: {
                [Op.gt]: 0 
            }
        },
        });
    }

    async obtenerPorEstado(estado_factura) {
        return await RegistroFacturaModel.RegistroFactura.findAll({
            where: { estado_factura },
        });
    }
    async actualizarRegistroFactura(id, data) {
        const registro = await RegistroFacturaModel.RegistroFactura.findByPk(id);
        if (!registro) return null;
        return await registro.update(data);
    }   
    async eliminarRegistroFactura(id) {
        const registro = await RegistroFacturaModel.RegistroFactura.findByPk(id);
        if (!registro) return null;
        await registro.destroy();
        return registro;
    }
}