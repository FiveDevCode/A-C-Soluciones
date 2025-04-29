// test/unit/auth.service.test.js

// Mock de las dependencias al inicio
jest.mock('../../../src/repository/usuario.repository.js');
jest.mock('../../../src/services/correo.services.js', () => ({
  enviarEmailRecuperacion: jest.fn().mockResolvedValue(true),
  enviarConfirmacionCambioContrasena: jest.fn().mockResolvedValue(true),
  enviarEmailBienvenida: jest.fn().mockResolvedValue(true)  // Agregar este mock
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../../src/database/conexion', () => ({
  sequelize: {
    transaction: jest.fn(),
  }
}));

import AuthService from '../../../src/services/usuario.services.js';
import UsuarioRepository from '../../../src/repository/usuario.repository.js';
import EmailService from '../../../src/services/correo.services.js';
import { sequelize } from '../../../src/database/conexion.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

// Definimos los mensajes de error directamente en el test para evitar dependencias
const ERROR_MESSAGES = {
  USUARIO_NO_ENCONTRADO: 'Usuario no encontrado',
  ERROR_OBTENER_USUARIO: 'Error al obtener usuario'
};

describe('AuthService.autenticarUsuario', () => {
  const fakeTransaction = {
    commit: jest.fn(),
    rollback: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    sequelize.transaction.mockResolvedValue(fakeTransaction);
    AuthService.generarTokenAcceso = jest.fn().mockReturnValue('fake-jwt-token');
  });

  it('debe autenticar al usuario correctamente si las credenciales son válidas', async () => {
    const fakeUser = {
      id: 1,
      correo_electronico: 'test@correo.com',
      rol: 'cliente',
      intentos_fallidos: 0,
      tiempo_bloqueo: null,
      updatedAt: new Date(),
      validarContrasena: jest.fn().mockResolvedValue(true)
    };

    UsuarioRepository.findByEmail.mockResolvedValue(fakeUser);

    const resultado = await AuthService.autenticarUsuario('test@correo.com', 'Password123');

    expect(UsuarioRepository.findByEmail).toHaveBeenCalledWith('test@correo.com', {
      includePassword: true,
      transaction: expect.any(Object)
    });

    expect(fakeUser.validarContrasena).toHaveBeenCalledWith('Password123');
    expect(resultado.success).toBe(true);
    expect(resultado.data?.usuario?.correo_electronico).toBe('test@correo.com');
    expect(resultado.data?.redireccion).toBe('/cliente/perfil');
    expect(resultado.data?.mensaje).toBe('Bienvenido a A-C Soluciones');
  });
});

describe('AuthService.solicitarRecuperacionContrasena', () => {
  const fakeTransaction = {
    commit: jest.fn(),
    rollback: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    sequelize.transaction.mockResolvedValue(fakeTransaction);
    AuthService.generarTokenRecuperacion = jest.fn().mockReturnValue('fake-token');
  });

  it('debe enviar email de recuperación si el usuario existe', async () => {
    const fakeUser = { id: 1, correo_electronico: 'user@test.com' };
    UsuarioRepository.findByEmail.mockResolvedValue(fakeUser);

    const result = await AuthService.solicitarRecuperacionContrasena('user@test.com');

    expect(UsuarioRepository.findByEmail).toHaveBeenCalled();
    expect(EmailService.enviarEmailRecuperacion).toHaveBeenCalledWith('user@test.com', 'fake-token');
    expect(result.success).toBe(true);
    expect(result.data.mensaje).toContain('recuperar su contraseña');
  });

  it('debe retornar éxito aunque el email no exista', async () => {
    UsuarioRepository.findByEmail.mockResolvedValue(null);

    const result = await AuthService.solicitarRecuperacionContrasena('noexiste@test.com');

    expect(UsuarioRepository.findByEmail).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.data.mensaje).toContain('recuperar su contraseña');
  });
});

describe('AuthService.restablecerContrasena', () => {
  const fakeTransaction = {
    commit: jest.fn(),
    rollback: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    sequelize.transaction.mockResolvedValue(fakeTransaction);
  });

  it('debe restablecer la contraseña si el token y la nueva contraseña son válidos', async () => {
    const fakeUser = {
      id: 1,
      correo_electronico: 'test@correo.com',
      token_recuperacion: 'hashed-token',
      expiracion_token_recuperacion: new Date(Date.now() + 3600000),
      validarContrasena: jest.fn().mockResolvedValue(false)
    };

    jwt.verify.mockReturnValue({ id: 1 });
    UsuarioRepository.findById.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);
    UsuarioRepository.updatePassword.mockResolvedValue(true);

    const result = await AuthService.restablecerContrasena('token-valido', 'NuevaPass123!');

    expect(result.success).toBe(true);
    expect(result.data.mensaje).toContain('actualizada');
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it('debe fallar si el token está expirado', async () => {
    jwt.verify.mockImplementation(() => {
      const err = new Error('jwt expired');
      err.name = 'TokenExpiredError';
      throw err;
    });

    const result = await AuthService.restablecerContrasena('expired-token', 'NuevaPass123!');

    expect(result.success).toBe(false);
    expect(result.error).toContain('expirado');
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });

  it('debe fallar si el token es inválido', async () => {
    jwt.verify.mockImplementation(() => {
      const err = new Error('invalid token');
      err.name = 'JsonWebTokenError';
      throw err;
    });

    const result = await AuthService.restablecerContrasena('invalid-token', 'NuevaPass123!');

    expect(result.success).toBe(false);
    expect(result.error).toContain('inválido');
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });

  it('debe fallar si la nueva contraseña es igual a la anterior', async () => {
    const fakeUser = {
      id: 1,
      correo_electronico: 'test@correo.com',
      token_recuperacion: 'hashed-token',
      expiracion_token_recuperacion: new Date(Date.now() + 3600000),
      validarContrasena: jest.fn().mockResolvedValue(true)
    };

    jwt.verify.mockReturnValue({ id: 1 });
    UsuarioRepository.findById.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);

    const result = await AuthService.restablecerContrasena('token-valido', 'MismaPass123');

    expect(result.success).toBe(false);
    expect(result.error).toContain('diferente');
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});

describe('AuthService.cambiarContrasena', () => {
  const fakeTransaction = {
    commit: jest.fn(),
    rollback: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    sequelize.transaction.mockResolvedValue(fakeTransaction);
  });

  it('debe cambiar la contraseña si la actual es válida y la nueva es diferente', async () => {
    const fakeUser = {
      id: 1,
      contrasena: 'hashed-old-password',
      validarContrasena: jest.fn().mockResolvedValue(true) // La contraseña actual es válida
    };
  
    UsuarioRepository.findById.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true); // Las contraseñas son diferentes
  
    UsuarioRepository.updatePassword.mockResolvedValue(true);
  
    const result = await AuthService.cambiarContrasena(1, 'Vieja123', 'Nueva456');
  
    console.log('Ver el resultado y comprobar:\n', JSON.stringify(result, null, 2));
  
    expect(fakeUser.validarContrasena).toHaveBeenCalledWith('Vieja123');
    expect(result.success).toBe(true);
    expect(result.data.mensaje).toContain('actualizada');
    expect(fakeTransaction.commit).toHaveBeenCalled();
  });

  it('debe fallar si la contraseña actual es incorrecta', async () => {
    const fakeUser = {
      id: 1,
      validarContrasena: jest.fn().mockResolvedValue(false)
    };

    UsuarioRepository.findById.mockResolvedValue(fakeUser);

    const result = await AuthService.cambiarContrasena(1, 'Incorrecta', 'Nueva456');

    expect(result.success).toBe(false);
    expect(result.error).toContain('actual');
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });

  it('debe fallar si la nueva contraseña es igual a la actual', async () => {
    const fakeUser = {
      id: 1,
      validarContrasena: jest.fn().mockResolvedValue(true)
    };

    UsuarioRepository.findById.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true); // nueva = actual

    const result = await AuthService.cambiarContrasena(1, 'Igual123', 'Igual123');

    expect(result.success).toBe(false);
    expect(result.error).toContain('diferente');
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });

  it('debe fallar si el usuario no existe', async () => {
    UsuarioRepository.findById.mockResolvedValue(null);

    const result = await AuthService.cambiarContrasena(999, 'Vieja123', 'Nueva456');

    expect(result.success).toBe(false);
    expect(result.error).toContain('Usuario no encontrado');
    expect(fakeTransaction.rollback).toHaveBeenCalled();
  });
});

describe('AuthService - listarUsuarios', () => {
  it('debería listar usuarios correctamente con paginación', async () => {
    const mockUsuarios = [
      { id: 1, nombre: 'Juan', correo_electronico: 'juan@test.com', rol: 'cliente', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nombre: 'Ana', correo_electronico: 'ana@test.com', rol: 'cliente', createdAt: new Date(), updatedAt: new Date() }
    ];

    const mockResultado = {
      data: mockUsuarios,
      total: 2,
      pages: 1,
      currentPage: 1
    };

    UsuarioRepository.findAll.mockResolvedValue(mockResultado);

    const response = await AuthService.listarUsuarios({ page: 1, limit: 10 });

    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
    expect(response.data.usuarios).toHaveLength(2);
    expect(response.data.paginacion.total).toBe(2);
  });

  it('debería manejar errores y retornar 500', async () => {
    UsuarioRepository.findAll.mockRejectedValue(new Error('DB Error'));

    const response = await AuthService.listarUsuarios({ page: 1, limit: 10 });

    expect(response.success).toBe(false);
    expect(response.status).toBe(500);
    expect(response.error).toBe('Error al listar usuarios');
  });
});

describe('AuthService - obtenerUsuarioPorId', () => {
  it('debería retornar los datos del usuario si existe', async () => {
    const mockUsuario = {
      id: 1,
      correo_electronico: 'juan@test.com',
      rol: 'cliente',
      nombre: 'Juan',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    UsuarioRepository.findById.mockResolvedValue(mockUsuario);

    const response = await AuthService.obtenerUsuarioPorId(1);

    expect(response.success).toBe(true);
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(mockUsuario.id);
    expect(response.data.correo_electronico).toBe(mockUsuario.correo_electronico);
  });

  it('debería retornar 404 si el usuario no existe', async () => {
    UsuarioRepository.findById.mockResolvedValue(null);

    const response = await AuthService.obtenerUsuarioPorId(999);

    expect(response.success).toBe(false);
    expect(response.status).toBe(404);
    expect(response.error).toBe(ERROR_MESSAGES.USUARIO_NO_ENCONTRADO);
  });

  it('debería manejar errores y retornar 500', async () => {
    UsuarioRepository.findById.mockRejectedValue(new Error('DB Error'));

    const response = await AuthService.obtenerUsuarioPorId(1);

    expect(response.success).toBe(false);
    expect(response.status).toBe(500);
    expect(response.error).toBe(ERROR_MESSAGES.ERROR_OBTENER_USUARIO);
  });
});

describe('AuthService.crearUsuario', () => {
  const fakeTransaction = {
    commit: jest.fn(),
    rollback: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    sequelize.transaction.mockResolvedValue(fakeTransaction);
    bcrypt.genSalt.mockResolvedValue('fake-salt');
    bcrypt.hash.mockResolvedValue('hashed-password');
    
    AuthService.filtrarDatosUsuario = jest.fn().mockImplementation(usuario => ({
      id: usuario.id,
      nombre: usuario.nombre,
      correo_electronico: usuario.correo_electronico,
      rol: usuario.rol
    }));
  });

  it('debe crear un usuario correctamente y enviar correo de confirmación', async () => {
    const datosUsuario = {
      nombre: 'Nuevo Usuario',
      correo_electronico: 'nuevo@test.com',
      contrasena: 'Pass123!',
      rol: 'cliente'
    };
  
    const usuarioCreado = {
      id: 1,
      ...datosUsuario,
      contrasena: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  
    UsuarioRepository.findByEmail.mockResolvedValue(null);
    UsuarioRepository.create.mockResolvedValue(usuarioCreado);
  
    const result = await AuthService.crearUsuario(datosUsuario);

    // Verificaciones del proceso
    expect(UsuarioRepository.findByEmail).toHaveBeenCalledWith(
      datosUsuario.correo_electronico, 
      { transaction: fakeTransaction }
    );
    
    expect(bcrypt.genSalt).toHaveBeenCalledWith(12);
    expect(bcrypt.hash).toHaveBeenCalledWith(datosUsuario.contrasena, 'fake-salt');
    
    expect(UsuarioRepository.create).toHaveBeenCalledWith(
      {
        ...datosUsuario,
        contrasena: 'hashed-password'
      },
      { transaction: fakeTransaction }
    );
    
    expect(EmailService.enviarEmailBienvenida).toHaveBeenCalledWith(datosUsuario.correo_electronico);
    expect(fakeTransaction.commit).toHaveBeenCalled();
    
    // Verificación de la estructura de respuesta ACTUAL
    expect(result).toEqual({
      success: true,
      status: 201,
      error: null,
      data: {
        usuario: {
          id: 1,
          nombre: 'Nuevo Usuario',
          correo_electronico: 'nuevo@test.com',
          rol: 'cliente'
        },
        mensaje: 'Usuario creado exitosamente'
      }
    });
  });
  // ... otros tests ...

  it('debe retornar error 409 si el email ya existe', async () => {
    const datosUsuario = {
      nombre: 'Usuario Existente',
      correo_electronico: 'existente@test.com',
      contrasena: 'Pass123!',
      rol: 'cliente'
    };

    // Mock de usuario existente
    UsuarioRepository.findByEmail.mockResolvedValue({
      id: 2,
      correo_electronico: 'existente@test.com'
    });

    const result = await AuthService.crearUsuario(datosUsuario);

    expect(result).toEqual({
      success: false,
      status: 409,
      error: 'El correo electrónico ya está registrado',
      data: null
    });

    expect(fakeTransaction.rollback).toHaveBeenCalled();
    expect(UsuarioRepository.create).not.toHaveBeenCalled();
    expect(EmailService.enviarEmailBienvenida).not.toHaveBeenCalled();
  });

  it('debe manejar errores y hacer rollback si falla la creación del usuario', async () => {
    const datosUsuario = {
      nombre: 'Usuario Fallido',
      correo_electronico: 'fallo@test.com',
      contrasena: 'Pass123!',
      rol: 'cliente'
    };

    UsuarioRepository.findByEmail.mockResolvedValue(null); // No existe
    UsuarioRepository.create.mockRejectedValue(new Error('Error de base de datos'));

    const result = await AuthService.crearUsuario(datosUsuario);

    expect(result).toEqual({
      success: false,
      status: 500,
      error: 'Error al crear usuario',
      data: null
    });

    expect(fakeTransaction.rollback).toHaveBeenCalled();
    expect(EmailService.enviarEmailBienvenida).not.toHaveBeenCalled();
  });
});