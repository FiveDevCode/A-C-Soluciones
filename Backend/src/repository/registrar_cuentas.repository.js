import { RegistroCuentaModel } from "../models/registrar_cuentas.model.js";


export class RegistrarCuentasRepository {
    async crearRegistroCuenta(data) {
        return await RegistroCuentaModel.RegistroCuenta.create(data);
    }

    async obtenerCuentaPorId(id_cliente) {
        return await RegistroCuentaModel.RegistroCuenta.findAll({
            where: { id_cliente },
        });
    }

    async obtenerCuentaPorIdCuenta(id) {
        return await RegistroCuentaModel.RegistroCuenta.findByPk(id);
    }

    async obtenerCuentaPorNumero(numero_cuenta) {
        return await RegistroCuentaModel.RegistroCuenta.findOne({
            where: { numero_cuenta },
        });
    }

    async obtenerCuentaPorNit(nit) {
        return await RegistroCuentaModel.RegistroCuenta.findOne({
            where: { nit },
        });
    }

    async obtenerCuentas() {
        return await RegistroCuentaModel.RegistroCuenta.findAll();
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
