import { ContableModel } from "../models/contable.model";


export class ContableRepository {

    async findByEmail(email) {
        return await ContableModel.Contable.findOne({
            where: { correo_electronico: email },
        });
    }

    async crearContable(data) {
        return await ContableModel.Contable.create(data);
    }

    async obtenerContablePorId(id) {
        return await ContableModel.Contable.findByPk(id);
    }

    async obtenerContablePorCedula(numero_de_cedula) {
        return await ContableModel.Contable.findOne({
            where: { numero_de_cedula }
        });
    }

    async obtenerContablePorCorreo(correo_electronico) {
        return await ContableModel.Contable.findOne({
            where: { correo_electronico }
        });
    }

    async obtenerContables() {
        return await ContableModel.Contable.findAll();
    }

    async actualizarContable(id, data) {
        const contable = await ContableModel.Contable.findByPk(id);
        if (!contable) return null;
        await contable.update(data);
        return contable;
    }

    
}