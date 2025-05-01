import { compare, hash, genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';

import { sequelize } from '../database/conexion.js';
import UsuarioRepository from '../repository/usuario.repository.js';
import EmailService from './correo.services.js';

//  configuracion
const AUTH_CONFIG = {
  TIEMPO_BLOQUEO: 5 * 60 * 1000,
  MAX_INTENTOS: 3,
  JWT_EXPIRATION: process.env.JWT_EXPIRES_IN || '24h',
  JWT_SECRET: process.env.JWT_SECRET || 'secreto_mejor_cambiar_en_produccion',
  JWT_RESET_SECRET: process.env.JWT_RESET_SECRET || 'reset_secret_diferente_para_mayor_seguridad',
  JWT_RESET_EXPIRES_IN: process.env.JWT_RESET_EXPIRES_IN || '1h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};

// Mensajes de errores
const ERROR_MESSAGES = {
  CREDENCIALES_INVALIDAS: 'Correo electrónico o contraseña incorrectos. Intente nuevamente.',
  CUENTA_BLOQUEADA: tiempo => `Cuenta bloqueada temporalmente. Intente nuevamente en ${tiempo} minutos.`,
  MAXIMO_INTENTOS: 'Ha excedido el número máximo de intentos. Su cuenta ha sido bloqueada por 5 minutos.',
  EMAIL_REQUERIDO: 'Debe proporcionar un correo electrónico',
  RESET_EMAIL: 'Si el correo existe en nuestra base de datos, recibirá instrucciones para recuperar su contraseña',
  TOKEN_INVALIDO: 'Token de recuperación inválido o expirado',
  CONTRASENA_REQUERIDA: 'La nueva contraseña es requerida',
  CONTRASENA_ACTUAL_INVALIDA: 'La contraseña actual es incorrecta',
  CONTRASENA_IGUAL: 'La nueva contraseña debe ser diferente a la actual',
  TOKEN_REVOCADO: 'El token ha sido revocado',
  TOKEN_EXPIRADO: 'El token ha expirado',
  USUARIO_NO_ENCONTRADO: 'Usuario no encontrado',
  EMAIL_DUPLICADO: 'El correo electrónico ya está registrado',
  AUTO_ELIMINACION: 'No puedes eliminar tu propia cuenta'
};

class AuthService {
  //autenticacion del usuario 
  async autenticarUsuario(correo_electronico, contrasenia) {
    const t = await sequelize.transaction();
    try {
      if (!correo_electronico || !contrasenia) {
        await t.rollback();
        return this.buildResponse(false, 400, ERROR_MESSAGES.CREDENCIALES_INVALIDAS);
      }

      const usuario = await UsuarioRepository.findByEmail(correo_electronico, {
        includePassword: true,
        transaction: t
      });

      if (!usuario) {
        await t.rollback();
        return this.buildResponse(false, 400, ERROR_MESSAGES.CREDENCIALES_INVALIDAS);
      }
      

      const bloqueoResponse = this.verificarBloqueoTemporal(usuario);
      if (bloqueoResponse) {
        await t.rollback();
        return bloqueoResponse;
      }
      //validmos que la controsena sea valida
      const contrasenaValida = await usuario.validarContrasena(contrasenia);

      if (!contrasenaValida) {
        const resultado = await this.manejarIntentoFallido(usuario, t);
        await t.commit();
        return resultado;
      }

      const resultado = await this.manejarAutenticacionExitosa(usuario, t);
      await t.commit();
      return resultado;

    } catch (error) {
      if (t && !t.finished) await t.rollback();
      console.error('[AuthService] Error en autenticarUsuario:', error);
      return this.buildResponse(false, 500, 'Error interno del servidor');
    }
  }

  //logica para que el susurio pueda solicitar la recuperacion de la contra
  async solicitarRecuperacionContrasena(correo_electronico) {
    const t = await sequelize.transaction();
    try {
      if (!correo_electronico) {
        await t.rollback();
        return this.buildResponse(false, 400, ERROR_MESSAGES.EMAIL_REQUERIDO);
      }

      const usuario = await UsuarioRepository.findByEmail(correo_electronico, { transaction: t });

      if (!usuario) {
        await t.rollback();
        return this.buildResponse(true, 200, null, { mensaje: ERROR_MESSAGES.RESET_EMAIL });
      }

      const token = this.generarTokenRecuperacion(usuario);
      const salt = await genSalt(10);
      const tokenHash = await hash(token, salt);

      await UsuarioRepository.updateRecoveryToken(
        usuario.id,
        tokenHash,
        new Date(Date.now() + 3600000),
        { transaction: t }
      );

      const emailEnviado = await EmailService.enviarEmailRecuperacion(usuario.correo_electronico, token);

      if (!emailEnviado) {
        await t.rollback();
        throw new Error('Error al enviar el correo electrónico');
      }

      await t.commit();
      return this.buildResponse(true, 200, null, { mensaje: ERROR_MESSAGES.RESET_EMAIL });

    } catch (error) {
      if (t && !t.finished) await t.rollback();
      console.error('[AuthService] Error en solicitarRecuperacionContrasena:', error);
      return this.buildResponse(false, 500, 'Error al procesar la solicitud');
    }
  }

  //logica para restablecer la contra
  async restablecerContrasena(token, nuevaContrasena) {
    const t = await sequelize.transaction();
    try {
      if (!token || !nuevaContrasena) {
        await t.rollback();
        return this.buildResponse(false, 400, ERROR_MESSAGES.CONTRASENA_REQUERIDA);
      }

      let payload;
      try {
        payload = jwt.verify(token, AUTH_CONFIG.JWT_RESET_SECRET);
      } catch (error) {
        await t.rollback();
        return this.buildResponse(false, 400, 
          error.name === 'TokenExpiredError' 
            ? ERROR_MESSAGES.TOKEN_EXPIRADO   //mensajes de errores
            : ERROR_MESSAGES.TOKEN_INVALIDO
        );
      }

      const usuario = await UsuarioRepository.findById(payload.id, { transaction: t });

      if (!usuario) {
        await t.rollback();
        return this.buildResponse(false, 400, ERROR_MESSAGES.TOKEN_INVALIDO);
      }

      if (!usuario.expiracion_token_recuperacion || new Date() > new Date(usuario.expiracion_token_recuperacion)) {
        await t.rollback();
        return this.buildResponse(false, 400, ERROR_MESSAGES.TOKEN_EXPIRADO);
      }

      const tokenValido = usuario.token_recuperacion && await compare(token, usuario.token_recuperacion);

      if (!tokenValido) {
        await t.rollback();
        return this.buildResponse(false, 400, ERROR_MESSAGES.TOKEN_INVALIDO);
      }

      const contrasenaValida = await usuario.validarContrasena(nuevaContrasena);
      if (contrasenaValida) {
        await t.rollback();
        return this.buildResponse(false, 400, ERROR_MESSAGES.CONTRASENA_IGUAL);
      }

      await UsuarioRepository.updatePassword(usuario.id, nuevaContrasena, { transaction: t }); //actualizar contra

      await EmailService.enviarConfirmacionCambioContrasena(usuario.correo_electronico);

      await t.commit();
      return this.buildResponse(true, 200, null, { mensaje: 'Contraseña actualizada correctamente' });

    } catch (error) {
      if (t && !t.finished) await t.rollback();
      console.error('[AuthService] Error en restablecerContrasena:', error);
      return this.buildResponse(false, 500, 'Error al restablecer contraseña');
    }
  }

  //token de recuperacion, pero esta logica lo que hace es verfiicar ese token 
  async verificarTokenRecuperacion(token) {
    const t = await sequelize.transaction();
    try {
      if (!token) {
        await t.rollback();
        return this.buildResponse(false, 400, 'Token es requerido');
      }

      let payload;
      try {
        payload = jwt.verify(token, AUTH_CONFIG.JWT_RESET_SECRET);
      } catch (error) {
        await t.rollback();
        return this.buildResponse(false, 400, 
          error.name === 'TokenExpiredError' 
            ? ERROR_MESSAGES.TOKEN_EXPIRADO  //estos mensajes de errores es para verificar el token, si es invalido pues muestra el error
            : ERROR_MESSAGES.TOKEN_INVALIDO);
      }

      const usuario = await UsuarioRepository.findById(payload.id, { transaction: t });

      if (!usuario) {
        await t.rollback();
        return this.buildResponse(false, 400, ERROR_MESSAGES.TOKEN_INVALIDO);
      }

      if (!usuario.expiracion_token_recuperacion || new Date() > new Date(usuario.expiracion_token_recuperacion)) {
        await t.rollback();
        return this.buildResponse(false, 400, ERROR_MESSAGES.TOKEN_EXPIRADO);
      }

      const tokenValido = usuario.token_recuperacion && await compare(token, usuario.token_recuperacion);

      if (!tokenValido) {
        await t.rollback();
        return this.buildResponse(false, 400, ERROR_MESSAGES.TOKEN_INVALIDO);
      }

      await t.commit();
      return this.buildResponse(true, 200, null, {
        mensaje: 'Token válido',
        email: usuario.correo_electronico
      });

    } catch (error) {
      if (t && !t.finished) await t.rollback();
      console.error('[AuthService] Error en verificarTokenRecuperacion:', error);
      return this.buildResponse(false, 500, 'Error al verificar token');
    }
  }

   // Cambio de contra para usuario 
async cambiarContrasena(usuarioId, contrasenaActual, nuevaContrasena) {
  const t = await sequelize.transaction();
  try {
    const usuario = await UsuarioRepository.findById(usuarioId, {
      includePassword: true,
      transaction: t
    });

    if (!usuario) {
      await t.rollback();
      return this.buildResponse(false, 404, ERROR_MESSAGES.USUARIO_NO_ENCONTRADO);
    }

    // Verificar si la nueva contraseña es diferente a la actual
    if (contrasenaActual === nuevaContrasena) {
      await t.rollback();
      return this.buildResponse(false, 400, ERROR_MESSAGES.CONTRASENA_IGUAL);
    }

    // aqui s la logica para validar que la contraseña actual sea correcta
    const contrasenaValida = await usuario.validarContrasena(contrasenaActual);
    if (!contrasenaValida) {
      await t.rollback();
      return this.buildResponse(false, 400, ERROR_MESSAGES.CONTRASENA_ACTUAL_INVALIDA);
    }

    // Actualizar la contraseña
    await UsuarioRepository.updatePassword(
      usuario.id,
      nuevaContrasena,
      { transaction: t }
    );

    // Enviar confirmación por correo
    await EmailService.enviarConfirmacionCambioContrasena(usuario.correo_electronico);

    // aqui para actualizarla
    await t.commit();
    return this.buildResponse(true, 200, null, {
      mensaje: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    // Rollback en caso de error
    if (t && !t.finished) await t.rollback();
    console.error('[AuthService] Error en cambiarContrasena:', error);
    return this.buildResponse(false, 500, 'Error al cambiar contraseña');
  }
}


  // Listar usuarios 
  async listarUsuarios({ page = 1, limit = 10, rol, searchTerm }) {
    const t = await sequelize.transaction();
    try {
      const resultado = await UsuarioRepository.findAll({
        page: parseInt(page),
        limit: parseInt(limit),
        rol,
        searchTerm
      }, { transaction: t });


      await t.commit();
     
      return this.buildResponse(true, 200, null, {
        usuarios: resultado.data.map(u => this.filtrarDatosUsuario(u)),
        paginacion: {
          total: resultado.total,
          paginas: resultado.pages,
          paginaActual: resultado.currentPage,
          porPagina: parseInt(limit)
        }
      });
    } catch (error) {
      if (t && !t.finished) await t.rollback();
      console.error('[AuthService] Error en listarUsuarios:', error);
      return this.buildResponse(false, 500, 'Error al listar usuarios');
    }
  }


  // Obtener usuario por ID
  async obtenerUsuarioPorId(id) {
    const t = await sequelize.transaction();
    try {
      const usuario = await UsuarioRepository.findById(id, {
        transaction: t
      });


      if (!usuario) {
        await t.rollback();
        return this.buildResponse(false, 404, ERROR_MESSAGES.USUARIO_NO_ENCONTRADO);
      }


      await t.commit();
      return this.buildResponse(true, 200, null, this.filtrarDatosUsuario(usuario));
    } catch (error) {
      if (t && !t.finished) await t.rollback();
      console.error('[AuthService] Error en obtenerUsuarioPorId:', error);
      return this.buildResponse(false, 500, 'Error al obtener usuario');
    }
  }


 // Servicio corregido (usuario.services.js):
async crearUsuario(datosUsuario) {
  const t = await sequelize.transaction();
  try {
    const usuarioExistente = await UsuarioRepository.findByEmail(datosUsuario.correo_electronico, {
      transaction: t
    });

    if (usuarioExistente) {
      await t.rollback();
      return this.buildResponse(false, 409, ERROR_MESSAGES.EMAIL_DUPLICADO);
    }

    const salt = await genSalt(12);
    const hashedPassword = await hash(datosUsuario.contrasenia, salt);

    const usuario = await UsuarioRepository.create({
      ...datosUsuario,
      contrasenia: hashedPassword
    }, { transaction: t });

    await t.commit();
    await EmailService.enviarEmailBienvenida(usuario.correo_electronico);

    // Cambio clave aquí - agregar null como tercer parámetro
    return this.buildResponse(true, 201, null, {
      usuario: this.filtrarDatosUsuario(usuario),
      mensaje: 'Usuario creado exitosamente'
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    console.error('[AuthService] Error en crearUsuario:', error);
    return this.buildResponse(false, 500, 'Error al crear usuario');
  }
}
  // Actualizar usuario existente
  async actualizarUsuario(id, datosActualizados) {
    const t = await sequelize.transaction();
    try {
      const usuarioExistente = await UsuarioRepository.findById(id, {
        transaction: t
      });


      if (!usuarioExistente) {
        await t.rollback();
        return this.buildResponse(false, 404, ERROR_MESSAGES.USUARIO_NO_ENCONTRADO);
      }


      if (datosActualizados.correo_electronico) {
        const usuarioConEmail = await UsuarioRepository.findByEmail(datosActualizados.correo_electronico, {
          transaction: t
        });


        if (usuarioConEmail && usuarioConEmail.id !== id) {
          await t.rollback();
          return this.buildResponse(false, 409, ERROR_MESSAGES.EMAIL_DUPLICADO);
        }
      }


      if (datosActualizados.contrasenia) {
        const salt = await genSalt(12);
        datosActualizados.contrasenia = await hash(datosActualizados.contrasenia, salt);
        datosActualizados.ultima_actualizacion_contrasena = new Date();
      }


      const [rowsUpdated, [usuarioActualizado]] = await UsuarioRepository.update(
        id,
        datosActualizados,
        { transaction: t }
      );


      if (rowsUpdated === 0) {
        await t.rollback();
        return this.buildResponse(false, 400, 'No se realizaron cambios');
      }


      await t.commit();
      return this.buildResponse(true, 200, null, this.filtrarDatosUsuario(usuarioActualizado));
    } catch (error) {
      if (t && !t.finished) await t.rollback();
      console.error('[AuthService] Error en actualizarUsuario:', error);
      return this.buildResponse(false, 500, 'Error al actualizar usuario');
    }
  }


  // Eliminar usuario 
  async eliminarUsuario(id, usuarioActualId) {
    const t = await sequelize.transaction();
    try {
      const usuario = await UsuarioRepository.findById(id, {
        transaction: t
      });


      if (!usuario) {
        await t.rollback();
        return this.buildResponse(false, 404, ERROR_MESSAGES.USUARIO_NO_ENCONTRADO);
      }


      if (usuarioActualId && usuario.id === usuarioActualId) {
        await t.rollback();
        return this.buildResponse(false, 403, ERROR_MESSAGES.AUTO_ELIMINACION);
      }


      const rowsDeleted = await UsuarioRepository.delete(id, {
        transaction: t
      });


      if (rowsDeleted === 0) {
        await t.rollback();
        return this.buildResponse(false, 400, 'No se pudo eliminar el usuario');
      }


      await t.commit();
      return this.buildResponse(true, 200, null, { mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
      if (t && !t.finished) await t.rollback();
      console.error('[AuthService] Error en eliminarUsuario:', error);
      return this.buildResponse(false, 500, 'Error al eliminar usuario');
    }
  }


  // logica de la verificacion de tiempo de bloqueo
  verificarBloqueoTemporal(usuario) {
    if (usuario.tiempo_bloqueo && new Date() < new Date(usuario.tiempo_bloqueo)) {
      const tiempoRestante = Math.ceil(
        (new Date(usuario.tiempo_bloqueo) - new Date()) / 1000 / 60
      );
      return this.buildResponse(
        false,
        403,
        ERROR_MESSAGES.CUENTA_BLOQUEADA(tiempoRestante)
      );
    }
    return null;
  }


  // logica de login fallido
  async manejarIntentoFallido(usuario, transaction) {
    const nuevosIntentos = (usuario.intentos_fallidos || 0) + 1;
    const tiempoBloqueo = nuevosIntentos >= AUTH_CONFIG.MAX_INTENTOS
      ? new Date(Date.now() + AUTH_CONFIG.TIEMPO_BLOQUEO)
      : null;


    await UsuarioRepository.updateFailedAttempts(
      usuario.id,
      nuevosIntentos,
      tiempoBloqueo,
      { transaction }
    );


    return this.buildResponse(false,
      nuevosIntentos >= AUTH_CONFIG.MAX_INTENTOS ? 403 : 400,
      nuevosIntentos >= AUTH_CONFIG.MAX_INTENTOS
        ? ERROR_MESSAGES.MAXIMO_INTENTOS
        : ERROR_MESSAGES.CREDENCIALES_INVALIDAS
    );
  }


  // logica de autenticación exitosa
  async manejarAutenticacionExitosa(usuario, transaction) {
    await UsuarioRepository.updateFailedAttempts(
      usuario.id,
      0,
      null,
      { transaction }
    );


    const token = this.generarTokenJWT(usuario);
    const refreshToken = this.generarRefreshToken(usuario);


    return this.buildResponse(true, 200, null, {
      token,
      refreshToken,
      usuario: this.filtrarDatosUsuario(usuario),
      ...this.getRedireccionPorRol(usuario.rol)
    });
  }


  // Generación de JWT
  generarTokenJWT(usuario) {
    return jwt.sign(   
      {
        id: usuario.id,
        correo_electronico: usuario.correo_electronico,
        rol: usuario.rol,
        version: usuario.updatedAt.getTime(),
        iss: process.env.JWT_ISSUER || 'your-app',
        aud: process.env.JWT_AUDIENCE || 'client'
      },
      AUTH_CONFIG.JWT_SECRET,
      {
        expiresIn: AUTH_CONFIG.JWT_EXPIRATION,
        algorithm: 'HS256'
      }
    );
  }


  // Generación de refresco de token
  generarRefreshToken(usuario) {
    return jwt.sign(   // Aquí está el cambio: sign → jwt.sign
      {
        id: usuario.id,
        version: usuario.updatedAt.getTime()
      },
      AUTH_CONFIG.JWT_SECRET,
      {
        expiresIn: AUTH_CONFIG.JWT_REFRESH_EXPIRES_IN,
        algorithm: 'HS256'
      }
    );
  }


  // Generación de token de recuperación
  generarTokenRecuperacion(usuario) {
    return jwt.sign(   // Aquí está el cambio: sign → jwt.sign
      { id: usuario.id },
      AUTH_CONFIG.JWT_RESET_SECRET,
      {
        expiresIn: AUTH_CONFIG.JWT_RESET_EXPIRES_IN,
        algorithm: 'HS256'
      }
    );
  }


  // Filtrado de datos del usuario 
  filtrarDatosUsuario(usuario) {
    return {
      id: usuario.id,
      correo_electronico: usuario.correo_electronico,
      rol: usuario.rol,
      nombre: usuario.nombre || null,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt
    };
  }


  // Obtener redirección por el rol, o sea, cada rol tiene sus propias vistas y permisos
  getRedireccionPorRol(rol) {
    const redirecciones = {
      administrador: {
        redireccion: '/admin/dashboard',
        mensaje: 'Bienvenido al panel de administración'
      },
      tecnico: {
        redireccion: '/tecnico/servicios',
        mensaje: 'Bienvenido al panel de técnico'
      },
      cliente: {
        redireccion: '/cliente/perfil',
        mensaje: 'Bienvenido a A-C Soluciones'
      }
    };
    return redirecciones[rol] || redirecciones.cliente;
  }


  // Función para construir respuestas consistentes
  buildResponse(success, status, error = null, data = null) {
    return { success, status, error, data };
  }
}


export default new AuthService();