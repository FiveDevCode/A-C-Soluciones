/**
 * test/unit/services/usuario.service.test.js
 *
 * Tests unitarios para src/services/usuario.services.js (AuthService)
 * - Mockeamos todos los modelos y dependencias antes de importar el servicio
 * - Cobertura completa de todos los métodos y ramas
 */

jest.mock('../../../src/models/administrador.model.js', () => ({
  AdminModel: { Admin: { findOne: jest.fn() } }
}));
jest.mock('../../../src/models/cliente.model.js', () => ({
  ClienteModel: { Cliente: { findOne: jest.fn() } }
}));
jest.mock('../../../src/models/tecnico.model.js', () => ({
  TecnicoModel: { Tecnico: { findOne: jest.fn() } }
}));
jest.mock('../../../src/models/contabilidad.model.js', () => ({
  // mockeo simple pero con la misma forma usada en el servicio (Contabilidad.Contabilidad.findOne)
  ContabilidadModel: { Contabilidad: { findOne: jest.fn() } }
}));

// Mock de bcrypt, jsonwebtoken y SibApiV3Sdk (Brevo)
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('sib-api-v3-sdk');

// Importar después de declarar los jest.mock
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import SibApiV3Sdk from 'sib-api-v3-sdk';

import { AuthService } from '../../../src/services/usuario.services.js';
import { AdminModel } from '../../../src/models/administrador.model.js';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { TecnicoModel } from '../../../src/models/tecnico.model.js';
import { ContabilidadModel } from '../../../src/models/contabilidad.model.js';

describe('AuthService (usuario.services.js) - unit tests', () => {
  let authService;
  const originalEnv = process.env;

  // usuario de prueba con la forma que usa el servicio
  const baseUser = {
    id: 1,
    nombre: 'Juan',
    apellido: 'Perez',
    correo_electronico: 'test@example.com',
    contrasenia: '$2b$10$hashfakehashfakehashfakehash', // comienza con $2b$
    rol: 'admin',
    estado: 'activo',
    especialidad: undefined,
    recovery_code: '123456',
    recovery_expires: new Date(Date.now() + 10 * 60 * 1000),
    update: jest.fn().mockResolvedValue(true)
  };

  // mocks para Brevo (sib-api-v3-sdk)
  const sendTransacEmailMock = jest.fn().mockResolvedValue({ status: 'sent' });

  beforeAll(() => {
    // silenciar console.error para no ensuciar salida de tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    process.env = { ...originalEnv };
    process.env.JWT_SECRET = 'test_jwt_secret';
    process.env.BREVO_API_KEY = 'test_brevo_key';
    process.env.EMAIL_SENDER = 'noreply@test.com';

    // configurar mock de SibApiV3Sdk
    // ApiClient.instance.authentications['api-key'].apiKey = ...
    SibApiV3Sdk.ApiClient = {
      instance: {
        authentications: { 'api-key': { apiKey: null } }
      }
    };
    SibApiV3Sdk.TransactionalEmailsApi = jest.fn().mockImplementation(() => ({
      sendTransacEmail: sendTransacEmailMock
    }));
  });

  afterAll(() => {
    // restaurar env y console
    process.env = originalEnv;
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
  });

  // ----------------- LOGIN -----------------
  describe('login()', () => {
    it('debe lanzar error si correo o contraseña son vacíos', async () => {
      await expect(authService.login('', 'pass')).rejects.toThrow('Correo y contraseña son requeridos');
      await expect(authService.login('a@b.com', '')).rejects.toThrow('Correo y contraseña son requeridos');
    });

    it('debe lanzar error si usuario no encontrado', async () => {
      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      await expect(authService.login('noexiste@test.com', '1234')).rejects.toThrow('Usuario no encontrado');
      expect(AdminModel.Admin.findOne).toHaveBeenCalled();
      expect(ClienteModel.Cliente.findOne).toHaveBeenCalled();
      expect(TecnicoModel.Tecnico.findOne).toHaveBeenCalled();
      expect(ContabilidadModel.Contabilidad.findOne).toHaveBeenCalled();
    });

    it('debe lanzar error cuando tecnico existe pero está inactivo', async () => {
      const tecnico = { ...baseUser, correo_electronico: 'tec@test.com', estado: 'inactivo', especialidad: 'mec' };
      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(tecnico);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      await expect(authService.login('tec@test.com', '1234')).rejects.toThrow('El empleado no está activo para ingresar al sistema');
    });

    it('debe lanzar error cuando admin existe pero está inactivo', async () => {
      const adminInactive = { ...baseUser, estado: 'inactivo' };
      AdminModel.Admin.findOne.mockResolvedValue(adminInactive);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      await expect(authService.login(adminInactive.correo_electronico, '1234')).rejects.toThrow('El administrador no está activo para ingresar al sistema');
    });

    it('debe lanzar error cuando cliente existe pero está inactivo', async () => {
      const clienteInactive = { ...baseUser, correo_electronico: 'c@test.com', estado: 'inactivo' };
      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(clienteInactive);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      await expect(authService.login(clienteInactive.correo_electronico, '1234')).rejects.toThrow('El cliente no está activo para ingresar al sistema');
    });

    it('debe lanzar error cuando contabilidad existe pero está inactivo', async () => {
      const cont = { ...baseUser, correo_electronico: 'cont@test.com', estado: 'inactivo' };
      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(cont);

      await expect(authService.login(cont.correo_electronico, '1234')).rejects.toThrow('El Contador no está activa para ingresar al sistema');
    });

    it('debe lanzar error si formato de contrasenia no es bcrypt', async () => {
      const userPlain = { ...baseUser, contrasenia: 'plaintext' };
      AdminModel.Admin.findOne.mockResolvedValue(userPlain);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      await expect(authService.login(userPlain.correo_electronico, '1234')).rejects.toThrow('Credenciales no válidas (formato incorrecto)');
    });

    it('debe lanzar error si bcrypt.compare retorna false', async () => {
      AdminModel.Admin.findOne.mockResolvedValue(baseUser);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login(baseUser.correo_electronico, 'wrongpass')).rejects.toThrow('Contraseña incorrecta');
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpass', baseUser.contrasenia);
    });

    it('debe retornar token y user correctamente para admin activo', async () => {
      AdminModel.Admin.findOne.mockResolvedValue(baseUser);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token_abc123');

      const res = await authService.login(baseUser.correo_electronico, 'rightpass');

      expect(res).toHaveProperty('token', 'token_abc123');
      expect(res.user).toMatchObject({
        id: baseUser.id,
        rol: baseUser.rol,
        nombre: baseUser.nombre,
        email: baseUser.correo_electronico
      });
      expect(jwt.sign).toHaveBeenCalled();
    });

    it('debe incluir especialidad en token y user si es tecnico', async () => {
      const tecnicoUser = { ...baseUser, correo_electronico: 'tec@test.com', especialidad: 'Redes' };
      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(tecnicoUser);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token_tecnico');

      const res = await authService.login(tecnicoUser.correo_electronico, 'rightpass');

      expect(res.user).toMatchObject({ especialidad: 'Redes' });
      expect(jwt.sign).toHaveBeenCalled();
    });
  });

  // ----------------- verifyToken -----------------
  describe('verifyToken()', () => {
    it('debe retornar decoded si token válido', async () => {
      jwt.verify.mockReturnValue({ id: 1, rol: 'admin', email: 'a@b.com' });

      const decoded = await authService.verifyToken('anytoken');
      expect(decoded).toMatchObject({ id: 1, rol: 'admin', email: 'a@b.com' });
      expect(jwt.verify).toHaveBeenCalledWith('anytoken', process.env.JWT_SECRET);
    });

    it('debe lanzar error si estructura no contiene id, rol o email', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'a@b.com' }); // falta rol
      await expect(authService.verifyToken('tok')).rejects.toThrow('Token inválido: estructura incorrecta');
    });

    it('debe propagar errores de jwt.verify', async () => {
      jwt.verify.mockImplementation(() => { throw new Error('jwt expired'); });
      await expect(authService.verifyToken('tok')).rejects.toThrow('jwt expired');
    });
  });

  // ----------------- sendRecoveryCode -----------------
  describe('sendRecoveryCode()', () => {
    it('debe lanzar error si correo no provisto', async () => {
      await expect(authService.sendRecoveryCode('')).rejects.toThrow('El correo es requerido');
    });

    it('debe lanzar error si usuario no existe', async () => {
      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      await expect(authService.sendRecoveryCode('no@test.com')).rejects.toThrow('Usuario no encontrado');
    });

    it('debe actualizar usuario y enviar email via Brevo (Sib) correctamente', async () => {
      const user = { ...baseUser, nombre: 'Ana', apellido: 'Lopez', update: jest.fn().mockResolvedValue(true) };
      AdminModel.Admin.findOne.mockResolvedValue(user);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      // sendTransacEmailMock configurado en beforeAll
      await expect(authService.sendRecoveryCode('test@example.com')).resolves.toBeUndefined();

      // user.update debe haber sido llamado para setear recovery_code y recovery_expires
      expect(user.update).toHaveBeenCalled();
      // la API transaccional de Brevo debe haberse instanciado y llamado
      expect(SibApiV3Sdk.TransactionalEmailsApi).toHaveBeenCalled();
      expect(sendTransacEmailMock).toHaveBeenCalled();
      // ApiClient.instance autentificación seteada (simulación)
      expect(SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey).toBe(process.env.BREVO_API_KEY);
    });
  });

  // ----------------- resetPassword -----------------
  describe('resetPassword()', () => {
    it('debe lanzar error si usuario no existe', async () => {
      // jwt.verify devuelve correo
      jwt.verify.mockReturnValue({ email: 'none@test.com', code: '1' });
      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      await expect(authService.resetPassword('none@test.com', '123', 'newpass')).rejects.toThrow('Usuario no encontrado');
    });

    it('debe lanzar error si código es inválido o expirado', async () => {
      const user = { ...baseUser, recovery_code: '000000', recovery_expires: new Date(Date.now() - 1000) }; // expirado
      jwt.verify.mockReturnValue({ email: user.correo_electronico, code: '000000' });
      AdminModel.Admin.findOne.mockResolvedValue(user);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      await expect(authService.resetPassword(user.correo_electronico, '000000', 'newpass')).rejects.toThrow('Código inválido o expirado');
    });

    it('debe hashear y actualizar la contraseña correctamente', async () => {
      const user = { ...baseUser, recovery_code: '123456', recovery_expires: new Date(Date.now() + 1000 * 60) , update: jest.fn().mockResolvedValue(true) };
      jwt.verify.mockReturnValue({ email: user.correo_electronico, code: '123456' });
      AdminModel.Admin.findOne.mockResolvedValue(user);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      bcrypt.hash.mockResolvedValue('new_hashed_pass');

      await expect(authService.resetPassword(user.correo_electronico, '123456', 'mypassword')).resolves.toBeUndefined();

      expect(bcrypt.hash).toHaveBeenCalledWith('mypassword', 10);
      expect(user.update).toHaveBeenCalledWith({
        contrasenia: 'new_hashed_pass',
        recovery_code: null,
        recovery_expires: null
      });
    });
  });

  // ----------------- verifyRecoveryCode -----------------
  describe('verifyRecoveryCode()', () => {
    it('debe lanzar error si correo no es string', async () => {
      await expect(authService.verifyRecoveryCode(null, '123')).rejects.toThrow('El correo electrónico es inválido o no fue proporcionado');
    });

    it('debe lanzar error si usuario no encontrado', async () => {
      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      await expect(authService.verifyRecoveryCode('no@test.com', '123')).rejects.toThrow('Usuario no encontrado');
    });

    it('debe lanzar error si no hay código guardado', async () => {
      const user = { ...baseUser, recovery_code: null, recovery_expires: new Date(Date.now() + 10000) };
      AdminModel.Admin.findOne.mockResolvedValue(user);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      await expect(authService.verifyRecoveryCode(user.correo_electronico, '123')).rejects.toThrow('Código incorrecto');
    });

    it('debe lanzar error si el código no coincide', async () => {
      const user = { ...baseUser, recovery_code: '111111', recovery_expires: new Date(Date.now() + 10000) };
      AdminModel.Admin.findOne.mockResolvedValue(user);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      await expect(authService.verifyRecoveryCode(user.correo_electronico, '222222')).rejects.toThrow('Código incorrecto');
    });

    it('debe lanzar error si el código expiró', async () => {
      const user = { ...baseUser, recovery_code: '111111', recovery_expires: new Date(Date.now() - 1000) };
      AdminModel.Admin.findOne.mockResolvedValue(user);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      await expect(authService.verifyRecoveryCode(user.correo_electronico, '111111')).rejects.toThrow('Código expirado');
    });

    it('debe retornar true si el código es válido y no expiró', async () => {
      const user = { ...baseUser, recovery_code: '999999', recovery_expires: new Date(Date.now() + 10000) };
      AdminModel.Admin.findOne.mockResolvedValue(user);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      await expect(authService.verifyRecoveryCode(user.correo_electronico, '999999')).resolves.toBe(true);
    });
  });

  // ----------------- _findUserByEmail -----------------
  describe('_findUserByEmail()', () => {
    it('debe retornar admin si existe', async () => {
      const admin = { id: 1, correo_electronico: 'a@test.com' };
      AdminModel.Admin.findOne.mockResolvedValue(admin);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      const res = await authService._findUserByEmail('a@test.com');
      expect(res).toBe(admin);
    });

    it('debe retornar cliente si no hay admin', async () => {
      AdminModel.Admin.findOne.mockResolvedValue(null);
      const cliente = { id: 2, correo_electronico: 'c@test.com' };
      ClienteModel.Cliente.findOne.mockResolvedValue(cliente);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      const res = await authService._findUserByEmail('c@test.com');
      expect(res).toBe(cliente);
    });

    it('debe retornar tecnico si no hay admin ni cliente', async () => {
      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      const tech = { id: 3, correo_electronico: 't@test.com' };
      TecnicoModel.Tecnico.findOne.mockResolvedValue(tech);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      const res = await authService._findUserByEmail('t@test.com');
      expect(res).toBe(tech);
    });

    it('debe retornar contabilidad si no hay admin, cliente, tecnico', async () => {
      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      const cont = { id: 4, correo_electronico: 'cont@test.com' };
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(cont);

      const res = await authService._findUserByEmail('cont@test.com');
      expect(res).toBe(cont);
    });

    it('debe retornar null si no existe ninguno', async () => {
      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ContabilidadModel.Contabilidad.findOne.mockResolvedValue(null);

      const res = await authService._findUserByEmail('x@test.com');
      expect(res).toBeNull();
    });
  });
});
