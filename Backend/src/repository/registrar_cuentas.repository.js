import { RegistroCuentaModel } from "../models/registrar_cuentas.model.js";
import { ClienteModel } from "../models/cliente.model.js";


export class RegistrarCuentasRepository {
    async crearRegistroCuenta(data) {
        return await RegistroCuentaModel.RegistroCuenta.create(data);
    }

    async obtenerCuentaPorId(id_cliente) {
        return await RegistroCuentaModel.RegistroCuenta.findAll({
            where: { id_cliente },
            include: [
                {
                    model: ClienteModel.Cliente,
                    as: "cliente",
                    attributes: ["id", "numero_de_cedula", "nombre", "apellido"]
                }
            ]
        });
    }

    async obtenerCuentaPorIdCuenta(id) {
        return await RegistroCuentaModel.RegistroCuenta.findByPk(id, {
            include: [
                {
                    model: ClienteModel.Cliente,
                    as: "cliente",
                    attributes: ["id", "numero_de_cedula", "nombre", "apellido"]
                }
            ]
        });
    }

    async obtenerCuentaPorNumero(numero_cuenta) {
        return await RegistroCuentaModel.RegistroCuenta.findOne({
            where: { numero_cuenta },
            include: [
                {
                    model: ClienteModel.Cliente,
                    as: "cliente",
                    attributes: ["id", "numero_de_cedula", "nombre", "apellido"]
                }
            ]
        });
    }

    async obtenerCuentaPorNit(nit) {
        return await RegistroCuentaModel.RegistroCuenta.findOne({
            where: { nit },
            include: [
                {
                    model: ClienteModel.Cliente,
                    as: "cliente",
                    attributes: ["id", "numero_de_cedula", "nombre", "apellido"]
                }
            ]
        });
    }

    async obtenerCuentas() {
        return await RegistroCuentaModel.RegistroCuenta.findAll({
            include: [
                {
                    model: ClienteModel.Cliente,
                    as: "cliente",
                    attributes: ["id", "numero_de_cedula", "nombre", "apellido"]
                }
            ]
        });
    }

    async actualizarRegistroCuenta(id, data) {
        const registro = await RegistroCuentaModel.RegistroCuenta.findByPk(id);
        if (!registro) return null;
        return await registro.update(data);
    }

    async eliminarRegistroCuenta(id) {
        const registro = await RegistroCuentaModel.RegistroCuenta.findByPk(id);
        if (!registro) return null;
        await registro.destroy();
        return registro;
    }
}
