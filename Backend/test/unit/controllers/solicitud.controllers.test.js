// tests/solicitud.controller.test.js
import { SolicitudController } from '/home/dao/Escritorio/Desarrollo de Software/Semestre2025_1/Desarrollo de Software II/A-C-Soluciones/Backend/src/controllers/solicitud.controller.js'
import { SolicitudService } from '../../../src/services/solicitud.services.js';
jest.mock('../../../src/services/solicitud.services.js');


describe('SolicitudController', () => {
  let controller;

  beforeEach(() => {
    controller = new SolicitudController();
  });

  it('debería crear una nueva solicitud', async () => {
    const req = { body: { descripcion: 'test', clienteId: 1, servicioId: 2 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    SolicitudService.prototype.crearSolicitud.mockResolvedValue({ id: 1, ...req.body });

    await controller.crearSolicitud(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ descripcion: 'test' }));
  });
});
