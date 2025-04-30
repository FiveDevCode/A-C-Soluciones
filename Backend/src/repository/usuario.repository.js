import { Op } from 'sequelize';
import { sequelize } from '../database/conexion.js';
import Usuario from '../models/usuario.model.js';

/**
 * Repositorio para el manejo de operaciones de CRUD sobre usuarios
 */
class UsuarioRepository {
   //Busca un usuario por ID
   
  async findById(id, options = {}) {
    return await Usuario.findByPk(id, { 
      ...options,
      attributes: { exclude: ['contrasenia'] } // No devolver contraseña
    });
  }
  
  // Busca un usuario por correo electrónico
   
  async findByEmail(email, options = {}) {
    const { includePassword = false, ...restOptions } = options;
    
    return await Usuario.findOne({
      where: { correo_electronico: email },
      attributes: includePassword ? undefined : { exclude: ['contrasenia'] },
      ...restOptions
    });
  }
  
   //Busca un usuario por token de recuperación
   
  async findByRecoveryToken(token, options = {}) {
    return await Usuario.findOne({
      where: { 
        token_recuperacion: token,
        expiracion_token_recuperacion: { 
          [Op.gt]: new Date() // Token no expirado
        } 
      },
      ...options
    });
  }
  
  // Crea un nuevo usuario
   
  async create(userData, options = {}) {
    return await Usuario.create(userData, options);
  }
  
  //Actualiza un usuario existente
   
  async update(id, userData, options = {}) {
    const [rowsUpdated, updated] = await Usuario.update(
      userData,
      { 
        where: { id },
        returning: true,
        ...options
      }
    );
    
    return [rowsUpdated, updated];
  }
  
  //Elimina un usuario de forma lógica (soft delete)
   
  async delete(id, options = {}) {
    return await Usuario.destroy({
      where: { id },
      ...options
    });
  }
  
   //Lista usuarios con paginación y filtros
   
  async findAll({ page = 1, limit = 10, rol, searchTerm }, options = {}) {
    const offset = (page - 1) * limit;
    const where = {};
    
    // Aplicar filtros
    if (rol) where.rol = rol;
    
    if (searchTerm) {
      where[Op.or] = [
        { correo_electronico: { [Op.iLike]: `%${searchTerm}%` } }
      ];
    }
    
    const { count, rows } = await Usuario.findAndCountAll({
      where,
      attributes: { exclude: ['contrasenia'] },
      offset,
      limit,
      order: [['created_at', 'DESC']],
      ...options
    });
    
    return {
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    };
  }
  
  
  async updateFailedAttempts(id, intentos, tiempoBloqueo = null, options = {}) {
    return await this.update(
      id, 
      { 
        intentos_fallidos: intentos,
        tiempo_bloqueo: tiempoBloqueo
      },
      options
    );
  }
  
   //Actualiza el token de recuperación de un usuario
   
  async updateRecoveryToken(id, token, expiracion, options = {}) {
    return await this.update(
      id,
      {
        token_recuperacion: token,
        expiracion_token_recuperacion: expiracion
      },
      options
    );
  }
  
  // Actualiza la contraseña de un usuario
   
   
  async updatePassword(id, contrasenia, options = {}) {
    return await this.update(
      id,
      {
        contrasenia,
        token_recuperacion: null,
        expiracion_token_recuperacion: null
      },
      options
    );
  }
  
   //Ejecuta una función dentro de una transacción
   
  async withTransaction(callback) {
    const t = await sequelize.transaction();
    
    try {
      const result = await callback(t);
      await t.commit();
      return result;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

export default new UsuarioRepository();