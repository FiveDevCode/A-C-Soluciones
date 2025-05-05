import { ServicioModel } from '../models/servicios.model.js';
import { Op } from 'sequelize';

export class ServicioRepository {
  async crearServicio(data) {
    return await ServicioModel.Servicio.create(data);
  }

  async obtenerServicioPorId(id) {
    return await ServicioModel.Servicio.findByPk(id);
  }

  async obtenerServicioPorNombre(nombre) {
    return await ServicioModel.Servicio.findOne({
      where: { 
        nombre: {
          [Op.iLike]: nombre // 
        }
      }
    });
  }

  async buscarServicios(termino) {
    return await ServicioModel.Servicio.findAll({
      where: {
        nombre: {
          [Op.iLike]: `%${termino}%` 
        }
      }
    });
  }

  async obtenerServicios() {
    return await ServicioModel.Servicio.findAll();
  }

  async obtenerServiciosActivos() {
    return await ServicioModel.Servicio.findAll({
      where: { estado: 'activo' }
    });
  }

  async actualizarServicio(id, data) {
    const servicio = await ServicioModel.Servicio.findByPk(id);
    if (!servicio) return null;
    await servicio.update(data);
    return servicio;
  }

  async eliminarServicio(id) {
    const servicio = await ServicioModel.Servicio.findByPk(id);
    if (!servicio) return null;
    await servicio.destroy();
    return true;
  }

  async deshabilitarServicio(id) {
    const servicio = await ServicioModel.Servicio.findByPk(id);
    if (!servicio) return null;
    servicio.estado = 'inactivo';
    await servicio.save();
    return servicio;
  }

  async habilitarServicio(id) {
    const servicio = await ServicioModel.Servicio.findByPk(id);
    if (!servicio) return null;
    servicio.estado = 'activo';
    await servicio.save();
    return servicio;
  }
}