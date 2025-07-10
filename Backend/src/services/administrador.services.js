// src/services/admin.service.js
import { AdminRepository } from '../repository/administrador.repository.js';

export class AdminService {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async crearAdmin(data) {
   return await this.adminRepository.crearAdmin(data);
  }

  async obtenerAdminPorId(id) {
    return await this.adminRepository.obtenerAdminPorId(id);
  }

  async obtenerAdminPorCedula(numero_cedula) {
    return await this.adminRepository.obtenerAdminPorCedula(numero_cedula);
  }

  async obtenerAdminPorCorreo(correo_electronico) {
    return await this.adminRepository.obtenerAdminPorCorreo(correo_electronico);
  }

  async obtenerAdmins() {
    return await this.adminRepository.obtenerAdmins();
  }

  async actualizarAdmin(id, data) {
    return await this.adminRepository.actualizarAdmin(id, data);
  }

  async eliminarAdmin(id) {
    return await this.adminRepository.eliminarAdmin(id);
  }
}