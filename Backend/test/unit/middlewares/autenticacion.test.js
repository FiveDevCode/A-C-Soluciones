// test/unit/middlewares/autenticacion.test.js
import { authenticate, authorize } from '../../../src/middlewares/autenticacion.js';
import { AuthService } from '../../../src/services/usuario.services.js';

jest.mock('../../../src/services/usuario.services.js');

describe('Middleware: authenticate', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer token-valido'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  test('Debe autenticar con token válido y asignar datos a req.user', async () => {
    const mockPayload = { id: 1, rol: 'admin', email: 'admin@example.com' };

    jest.spyOn(AuthService.prototype, 'verifyToken')
        .mockResolvedValue(mockPayload);

    await authenticate(req, res, next);

    expect(req.user).toEqual(mockPayload);
    expect(next).toHaveBeenCalled();
  });

  test('Debe devolver 401 si no hay token', async () => {
    req.headers.authorization = null;

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Formato de token inválido. Use: Bearer <token>'
    });
  });

  test('Debe manejar error TokenExpiredError', async () => {
    const error = new Error('Token expirado');
    error.name = 'TokenExpiredError';

    jest.spyOn(AuthService.prototype, 'verifyToken')
        .mockRejectedValue(error);

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token expirado'
    });
  });

  test('Debe manejar error genérico', async () => {
    const error = new Error('Otro error');
    error.name = 'OtroError';

    jest.spyOn(AuthService.prototype, 'verifyToken')
        .mockRejectedValue(error);

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token inválido'
    });
  });
});

describe('Middleware: authorize', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {
        rol: 'cliente'
      },
      path: '/ruta/protegida'
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  test('Debe permitir acceso si no se especifican roles', () => {
    const middleware = authorize();
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('Debe permitir acceso si el rol está incluido', () => {
    req.user.rol = 'admin';
    const middleware = authorize(['admin', 'tecnico']);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('Debe denegar acceso si el rol no está incluido', () => {
    req.user.rol = 'cliente';
    const middleware = authorize(['admin', 'tecnico']);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Acceso denegado. Se requieren los roles: admin, tecnico'
    });
  });
});
