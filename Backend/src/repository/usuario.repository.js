import { UsuarioModel } from '../models/usuario.model.js';

export class UsuarioRepository {
  // Obtener usuario por correo electrónico
  async obtenerPorCorreo(correo_electronico) {
    return await UsuarioModel.Usuario.findOne({ where: { correo_electronico } });
  }

  // Crear nuevo usuario
  async crearUsuario(data) {
    return await UsuarioModel.Usuario.create(data);
  }

   async eliminarUsuario(id) {
    return await UsuarioModel.Usuario.findOne({ where: { id } });
  }
 
}
