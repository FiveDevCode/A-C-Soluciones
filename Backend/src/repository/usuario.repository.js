import Usuario from '../models/usuario.model.js';

export class UsuarioRepository {
  // Definir findByEmail como método estático
  async findByEmail(correo_electronico) {
    return await Usuario.findOne({ where: { correo_electronico: correo_electronico } });
  }
}
