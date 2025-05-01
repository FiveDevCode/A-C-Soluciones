import AuthService from '../services/usuario.services.js';

// HTTP centralizados
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Mensajes de error centralizados
const ERROR_MESSAGES = {
  CREDENCIALES_INVALIDAS: 'Credenciales inválidas',
  DATOS_INCOMPLETOS: 'Datos incompletos en la solicitud',
  ERROR_PROCESAMIENTO: 'Error al procesar la solicitud',
  ERROR_SERVIDOR: 'Error interno del servidor',
  USUARIO_NO_ENCONTRADO: 'Usuario no encontrado',
  ACCESO_NO_AUTORIZADO: 'Acceso no autorizado',
  EMAIL_DUPLICADO: 'El correo electrónico ya está registrado'
};

class AuthController {
  //inicio de sesion
  async login(req, res) {
    const { correo_electronico, contrasenia } = req.body;

    if (!correo_electronico?.trim() || !contrasenia?.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.DATOS_INCOMPLETOS,
        detalles: 'Correo electrónico y contraseña son requeridos'
      });
    }

    try {
      const resultado = await AuthService.autenticarUsuario(
        correo_electronico.trim(),
        contrasenia.trim()
      );
      return res.status(resultado.status || HTTP_STATUS.OK).json(resultado);
    } catch (error) {
      console.error('[Auth Controller] Error en login:', error);
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.ERROR_SERVIDOR,
        detalles: process.env.NODE_ENV === 'production' ? 'Error de autenticación' : error.message
      });
    }
  }

  //aqui es para solicitar la recuperacion de contraseña
  async solicitarRecuperacion(req, res) {
    const { correo_electronico } = req.body;

    if (!correo_electronico?.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.DATOS_INCOMPLETOS,
        detalles: 'El correo electrónico es requerido'
      });
    }

    try {
      const resultado = await AuthService.solicitarRecuperacionContrasena(
        correo_electronico.trim()
      );
      return res.status(resultado.status || HTTP_STATUS.OK).json(resultado);
    } catch (error) {
      console.error('[Auth Controller] Error en solicitarRecuperacion:', error);
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.ERROR_PROCESAMIENTO,
        detalles: process.env.NODE_ENV === 'production' ? 'Error al procesar la solicitud' : error.message
      });
    }
  }

  //aqui se restablece si el tokem es valido
  async restablecerPassword(req, res) {
    const { token, nuevaContrasena } = req.body;

    if (!token?.trim() || !nuevaContrasena?.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.DATOS_INCOMPLETOS,
        detalles: 'Token y nueva contraseña son requeridos'
      });
    }

    try {
      const resultado = await AuthService.restablecerContrasena(
        token.trim(),
        nuevaContrasena.trim()
      );
      return res.status(resultado.status || HTTP_STATUS.OK).json(resultado);
    } catch (error) {
      console.error('[Auth Controller] Error en restablecerPassword:', error);
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.ERROR_PROCESAMIENTO,
        detalles: process.env.NODE_ENV === 'production' ? 'Error al restablecer contraseña' : error.message
      });
    }
  }

  //verifca el token
  async verificarTokenRecuperacion(req, res) {
    const { token } = req.body;

    if (!token?.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.DATOS_INCOMPLETOS,
        detalles: 'Token es requerido'
      });
    }

    try {
      const resultado = await AuthService.verificarTokenRecuperacion(token.trim());
      return res.status(resultado.status || HTTP_STATUS.OK).json(resultado);
    } catch (error) {
      console.error('[Auth Controller] Error en verificarTokenRecuperacion:', error);
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.ERROR_PROCESAMIENTO,
        detalles: process.env.NODE_ENV === 'production' ? 'Error al verificar token' : error.message
      });
    }
  }

  //se cambia ya la contra del usuairo
  async cambiarContrasena(req, res) {
    const { contrasenaActual, nuevaContrasena } = req.body;
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    if (!contrasenaActual?.trim() || !nuevaContrasena?.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: ERROR_MESSAGES.DATOS_INCOMPLETOS,
        detalles: 'Ambas contraseñas son requeridas'
      });
    }

    try {
      const resultado = await AuthService.cambiarContrasena(
        usuarioId,
        contrasenaActual.trim(),
        nuevaContrasena.trim()
      );
      
      if (resultado.success) {
        AuthService.invalidarTokensUsuario(usuarioId);
      }
      
      return res.status(resultado.status || HTTP_STATUS.OK).json(resultado);
    } catch (error) {
      console.error('[Auth Controller] Error en cambiarContrasena:', error);
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.ERROR_PROCESAMIENTO,
        detalles: process.env.NODE_ENV === 'production' ? 'Error al cambiar contraseña' : error.message
      });
    }
  }

  //cerrar sesion
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        AuthService.invalidarToken(token);
      }
      
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Sesión cerrada correctamente',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[Auth Controller] Error en logout:', error);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Sesión cerrada'
      });
    }
  }

  //se verifica la sesion si esta activa
  async verificarSesion(req, res) {
    try {
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        usuario: {
          id: req.usuario.id,
          correo_electronico: req.usuario.correo_electronico,
          rol: req.usuario.rol
        },
        expira_en: req.usuario.exp
          ? new Date(req.usuario.exp * 1000).toISOString()
          : null
      });
    } catch (error) {
      console.error('[Auth Controller] Error en verificarSesion:', error);
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        success: false,
        error: 'Error al verificar sesión'
      });
    }
  }

  //refresco token
  async refrescarToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Token de refresco requerido'
      });
    }

    try {
      const resultado = await AuthService.refrescarToken(refreshToken);
      return res.status(resultado.status || HTTP_STATUS.OK).json(resultado);
    } catch (error) {
      console.error('[Auth Controller] Error en refrescarToken:', error);
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'Token de refresco inválido',
        detalles: process.env.NODE_ENV === 'production' ? null : error.message
      });
    }
  }

  //listado de usuario
  async listarUsuarios(req, res) {
    try {
      const { page = 1, limit = 10, rol, search } = req.query;
      
      const resultado = await AuthService.listarUsuarios({
        page: parseInt(page),
        limit: parseInt(limit),
        rol,
        searchTerm: search
      });
      
      return res.status(HTTP_STATUS.OK).json(resultado);
    } catch (error) {
      console.error('[Auth Controller] Error en listarUsuarios:', error);
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.ERROR_PROCESAMIENTO,
        detalles: process.env.NODE_ENV === 'production' ? null : error.message
      });
    }
  }

  //solo admin puede buscar usuarios
  async obtenerUsuario(req, res) {
    try {
      const { id } = req.params;
      const resultado = await AuthService.obtenerUsuarioPorId(id);
      return res.status(resultado.status || HTTP_STATUS.OK).json(resultado);
    } catch (error) {
      console.error('[Auth Controller] Error en obtenerUsuario:', error);
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.ERROR_PROCESAMIENTO,
        detalles: process.env.NODE_ENV === 'production' ? null : error.message
      });
    }
  }

  //creacion de un nuevo usuario
  async crearUsuario(req, res) {
    try {
      const { correo_electronico, contrasenia, rol } = req.body;
      
      if (!correo_electronico?.trim() || !contrasenia?.trim()) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: ERROR_MESSAGES.DATOS_INCOMPLETOS,
          detalles: 'Correo electrónico y contraseña son requeridos'
        });
      }
      
      const resultado = await AuthService.crearUsuario({
        correo_electronico: correo_electronico.trim(),
        contrasenia: contrasenia.trim(),
        rol: rol || 'cliente'
      });
      
      return res.status(resultado.status || HTTP_STATUS.CREATED).json(resultado);
    } catch (error) {
      console.error('[Auth Controller] Error en crearUsuario:', error);
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.ERROR_PROCESAMIENTO,
        detalles: process.env.NODE_ENV === 'production' ? 'Error al crear usuario' : error.message
      });
    }
  }

  //actualiza los datos usario (solo admin)
  async actualizarUsuario(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;
      
      if (!id || Object.keys(datosActualizados).length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: ERROR_MESSAGES.DATOS_INCOMPLETOS,
          detalles: 'Datos de actualización requeridos'
        });
      }
      
      const resultado = await AuthService.actualizarUsuario(id, datosActualizados);
      return res.status(resultado.status || HTTP_STATUS.OK).json(resultado);
    } catch (error) {
      console.error('[Auth Controller] Error en actualizarUsuario:', error);
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.ERROR_PROCESAMIENTO,
        detalles: process.env.NODE_ENV === 'production' ? 'Error al actualizar usuario' : error.message
      });
    }
  }

  //elimina un usuario(solo admin)
  async eliminarUsuario(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: ERROR_MESSAGES.DATOS_INCOMPLETOS,
          detalles: 'ID de usuario es requerido'
        });
      }
      
      const resultado = await AuthService.eliminarUsuario(id);
      return res.status(resultado.status || HTTP_STATUS.OK).json(resultado);
    } catch (error) {
      console.error('[Auth Controller] Error en eliminarUsuario:', error);
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.ERROR_PROCESAMIENTO,
        detalles: process.env.NODE_ENV === 'production' ? 'Error al eliminar usuario' : error.message
      });
    }
  }
}

export default new AuthController();