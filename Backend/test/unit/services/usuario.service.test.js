// Mock completo de sib-api-v3-sdk
jest.mock('sib-api-v3-sdk', () => {
  const mockSendTransacEmail = jest.fn().mockResolvedValue({});
  return {
    ApiClient: {
      instance: {
        authentications: {
          'api-key': { apiKey: '' }
        }
      }
    },
    TransactionalEmailsApi: jest.fn().mockImplementation(() => ({
      sendTransacEmail: mockSendTransacEmail
    }))
  };
});



import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../../src/services/usuario.services.js';
import { AdminModel } from '../../../src/models/administrador.model.js';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { TecnicoModel } from '../../../src/models/tecnico.model.js';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../../src/models/administrador.model.js');
jest.mock('../../../src/models/cliente.model.js');
jest.mock('../../../src/models/tecnico.model.js');

describe('AuthService', () => {
  const service = new AuthService();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería loguear correctamente como cliente y retornar el token', async () => {
      const mockCliente = {
        id: 2,
        nombre: 'Cliente Test',
        correo_electronico: 'cliente@correo.com',
        contrasenia: '$2b$hash',
        rol: 'cliente'
      };

      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(mockCliente);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-token');

      const result = await service.login('cliente@correo.com', '123456');

      expect(result).toEqual({
        token: 'fake-token',
        user: {
          id: 2,
          rol: 'cliente',
          nombre: 'Cliente Test',
          email: 'cliente@correo.com'
        }
      });
    });

    it('debería lanzar error si usuario no existe', async () => {
      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);

      await expect(service.login('invalido@correo.com', '123'))
        .rejects.toThrow('Usuario no encontrado');
    });

    it('debería lanzar error si la contraseña no tiene formato hash', async () => {
      ClienteModel.Cliente.findOne.mockResolvedValue({
        id: 2,
        nombre: 'Test',
        correo_electronico: 'cliente@correo.com',
        contrasenia: '123456',
        rol: 'cliente'
      });

      AdminModel.Admin.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);

      await expect(service.login('cliente@correo.com', '123456'))
        .rejects.toThrow('Credenciales no válidas (formato incorrecto)');
    });

    it('debería lanzar error si la contraseña es incorrecta', async () => {
      ClienteModel.Cliente.findOne.mockResolvedValue({
        id: 2,
        nombre: 'Test',
        correo_electronico: 'cliente@correo.com',
        contrasenia: '$2b$hashvalido',
        rol: 'cliente'
      });

      AdminModel.Admin.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);

      bcrypt.compare.mockResolvedValue(false);

      await expect(service.login('cliente@correo.com', 'wrongpass'))
        .rejects.toThrow('Contraseña incorrecta');
    });
  });

  describe('verifyToken', () => {
    it('debería devolver los datos decodificados si el token es válido', async () => {
      const mockPayload = {
        id: 1,
        rol: 'admin',
        email: 'admin@correo.com'
      };

      jwt.verify.mockReturnValue(mockPayload);

      const result = await service.verifyToken('valid-token');

      expect(result).toEqual(mockPayload);
    });

    it('debería lanzar error si el token tiene estructura incorrecta', async () => {
      jwt.verify.mockReturnValue({ id: 1 }); 

      await expect(service.verifyToken('invalid-struct-token'))
        .rejects.toThrow('Token inválido: estructura incorrecta');
    });

    it('debería lanzar error si el token es inválido', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      await expect(service.verifyToken('bad-token')).rejects.toThrow('jwt malformed');
    });
  });

  describe('sendRecoveryCode', () => {
    it('debería generar y guardar el código de recuperación si el usuario existe', async () => {
      const mockUser = {
        id: 10,
        correo_electronico: 'example32@gmail.com',
        update: jest.fn().mockResolvedValue(true)
      };

      AdminModel.Admin.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(mockUser);

      await service.sendRecoveryCode('example32@gmail.com');

      expect(mockUser.update).toHaveBeenCalledWith(
        expect.objectContaining({
          recovery_code: expect.stringMatching(/^\d{6}$/), 
          recovery_expires: expect.any(Date)
        })
      );
    });

    it('debería lanzar error si el usuario no existe', async () => {
      AdminModel.Admin.findOne.mockResolvedValue(null);
      ClienteModel.Cliente.findOne.mockResolvedValue(null);
      TecnicoModel.Tecnico.findOne.mockResolvedValue(null);

      await expect(
        service.sendRecoveryCode('noexiste@correo.com')
      ).rejects.toThrow('Usuario no encontrado');
    });
  });
});
