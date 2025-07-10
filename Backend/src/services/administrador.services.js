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

  async autenticarAdmin(correo_electronico, contrasenia) {
    const admin = await this.adminRepository.obtenerAdminPorCorreo(correo_electronico);
    console.log('ADMIN ENCONTRADO:', admin?.estado);
    if (!admin) {
      throw new Error('Correo o contraseña incorrectos');
  }

    if (admin.estado !== 'activo') {
        console.log('ADMIN INACTIVO BLOQUEADO'); 

      throw new Error('El administrador está inactivo');
  }

    const passwordValida = await bcrypt.compare(contrasenia, admin.contrasenia);
      if (!passwordValida) {
        throw new Error('Correo o contraseña incorrectos');
  }

    return admin;
}

  async eliminarAdmin(id) {
    return await this.adminRepository.eliminarAdmin(id);
  }
}


