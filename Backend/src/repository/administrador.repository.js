// src/repositories/admin.repository.js
import { AdminModel } from '../models/administrador.model.js';

export class AdminRepository {
  async crearAdmin(data) {
    return await AdminModel.Admin.create(data);
  }

  async obtenerAdminPorId(id) {
    return await AdminModel.Admin.findByPk(id);
  }

  async obtenerAdminPorCedula(numero_cedula) {
    return await AdminModel.Admin.findOne({ 
      where: { numero_cedula } 
    });
  }

  async obtenerAdminPorCorreo(correo_electronico) {
    return await AdminModel.Admin.findOne({ 
      where: { correo_electronico } 
    });
  }

  async obtenerAdmins() {
    return await AdminModel.Admin.findAll();
  }

  async actualizarAdmin(id, data) {
    const admin = await AdminModel.Admin.findByPk(id);
    if (!admin) return null;
    await admin.update(data);
    return admin;
  }

  async eliminarAdmin(id) {
    const admin = await AdminModel.Admin.findByPk(id);
    if (!admin) return null;
    if (admin.estado) {
      admin.estado = 'inactivo';
      await admin.save();
    } else {
      await admin.destroy();
    }
    return admin;
  }
}




