import { TecnicoModel } from '../models/tecnico.model.js';

export class TecnicoRepository {
  async crearTecnico(data) {
    return await TecnicoModel.Tecnico.create(data);
  }

  async obtenerTecnicoPorId(id) {
    return await TecnicoModel.Tecnico.findByPk(id);
  }

  async obtenerTecnicoPorcedula(numero_de_cedula) {
    return await TecnicoModel.Tecnico.findOne({
      where: { numero_de_cedula }
    });
  }

  async obtenerTecnicos() {
    return await TecnicoModel.Tecnico.findAll();
  }

  async actualizarTecnico(id, data) {
    const tecnico = await TecnicoModel.Tecnico.findByPk(id);
    if (!tecnico) return null;
    await tecnico.update(data);
    return tecnico;
  }

  async eliminarTecnico(id) {
    const tecnico = await TecnicoModel.Tecnico.findByPk(id);
    if (!tecnico) return null;
    await tecnico.destroy();
    return tecnico;
  }
}
