import { ContabilidadModel } from "../models/contabilidad.model.js";

export class ContabilidadRepository {
  async crearContabilidad(data) {
    return await ContabilidadModel.Contabilidad.create(data);
  }

  async obtenerContabilidadPorId(id) {
    return await ContabilidadModel.Contabilidad.findByPk(id);
  }
  async obtenerContabilidadPorCedula(numero_de_cedula) {
    return await ContabilidadModel.Contabilidad.findOne({
      where: { numero_de_cedula },
    });
  }
  async obtenerContabilidadPorCorreo(correo_electronico) {
    return await ContabilidadModel.Contabilidad.findOne({
      where: { correo_electronico },
    });
  }
  async obtenerContabilidads() {
    return await ContabilidadModel.Contabilidad.findAll();
  }

  // solo falta el mentodo para actualizar

  async eliminarContabilidad(id) {
    const contabilidad = await ContabilidadModel.Contabilidad.findByPk(id);
    if (!contabilidad) return null;
    if (contabilidad.estado) {
      contabilidad.estado = "inactivo";
      await contabilidad.save();
    } else {
      await contabilidad.destroy();
    }
    return contabilidad;
  }
}
