import { AuthController } from '../../../src/controllers/usuario.controller.js';
import { AuthService } from '../../../src/services/usuario.services.js';

jest.mock('../../../src/services/usuario.services.js');

describe('AuthController', () => {
  let controller;
  let req;
  let res;
  let statusMock;
  let jsonMock;

  beforeEach(() => {
    controller = new AuthController();

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    res = { status: statusMock, json: jsonMock };

    req = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería autenticar correctamente y devolver el token', async () => {
      const mockTokenData = {
        token: 'jwt-fake-token',
        user: { id: 1, rol: 'cliente', email: 'cliente@correo.com', nombre: 'Cliente' }
      };

      req.body = { correo_electronico: 'cliente@correo.com', contrasenia: '123456' };
      controller.authService.login.mockResolvedValue(mockTokenData);

      await controller.login(req, res);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockTokenData);
    });

    it('debería retornar error 401 si falla el login', async () => {
      req.body = { correo_electronico: 'cliente@correo.com', contrasenia: 'incorrecta' };
      controller.authService.login.mockRejectedValue(new Error('Credenciales inválidas'));

      await controller.login(req, res);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Credenciales inválidas' });
    });
  });

  describe('verify', () => {
    it('debería verificar el token y retornar los datos decodificados', async () => {
      const decoded = {
        id: 1,
        rol: 'admin',
        email: 'admin@correo.com'
      };

      req.headers = { authorization: 'Bearer valid-token' };
      controller.authService.verifyToken.mockResolvedValue(decoded);

      await controller.verify(req, res);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(decoded);
    });

    it('debería retornar 401 si no se proporciona el token', async () => {
      req.headers = {};

      await controller.verify(req, res);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
    });

    it('debería retornar 401 si el token es inválido', async () => {
      req.headers = { authorization: 'Bearer invalid-token' };
      controller.authService.verifyToken.mockRejectedValue(new Error('Token inválido'));

      await controller.verify(req, res);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Token inválido o expirado' });
    });
  });
});
