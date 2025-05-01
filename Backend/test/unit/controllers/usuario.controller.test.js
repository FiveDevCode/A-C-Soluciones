import AuthController from '../../../src/controllers/usuario.controller.js';
import AuthService from '../../../src/services/usuario.services.js';

describe('AuthController - login', () => {
  const mockReq = {};
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar 400 si faltan credenciales', async () => {
    mockReq.body = { correo_electronico: '', contrasenia: '' };

    await AuthController.login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      error: expect.any(String)
    }));
  });

  it('debera retornar 200 con respuesta exitosa si las credenciales son validas', async () => {
    mockReq.body = { correo_electronico: 'test@example.com', contrasenia: '123456' };

    const mockResultado = { success: true, token: 'abc123' };
    AuthService.autenticarUsuario = jest.fn().mockResolvedValue(mockResultado);

    await AuthController.login(mockReq, mockRes);

    expect(AuthService.autenticarUsuario).toHaveBeenCalledWith('test@example.com', '123456');
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockResultado);
  });

  it('debera retornar 500 si hay un error en el servicio', async () => {
    mockReq.body = { correo_electronico: 'test@example.com', contrasenia: '123456' };

    AuthService.autenticarUsuario = jest.fn().mockRejectedValue(new Error('Fallo en BD'));

    await AuthController.login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      error: expect.any(String)
    }));
  });
});
