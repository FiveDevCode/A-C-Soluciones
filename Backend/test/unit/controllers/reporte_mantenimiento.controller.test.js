// Mocks ANTES de imports
jest.mock('../../../src/models/cliente.model.js', () => ({
    ClienteModel: {
        Cliente: {
            findByPk: jest.fn()
        }
    }
}));

jest.mock('../../../src/models/tecnico.model.js', () => ({
    TecnicoModel: {
        Tecnico: {
            findByPk: jest.fn()
        }
    }
}));

jest.mock('../../../src/services/reporte_mantenimiento.services.js', () => ({
    generarPDFReporte: jest.fn()
}));

jest.mock('../../../src/services/email.services.js', () => ({
    sendEmail: jest.fn()
}));

jest.mock('../../../src/repository/reporte_mantenimiento.repository.js', () => ({
    crearReporte: jest.fn(),
    crearParametrosOperacion: jest.fn(),
    crearVerificaciones: jest.fn(),
    obtenerReportePorId: jest.fn(),
    obtenerReportesPorCliente: jest.fn(),
    obtenerReportesPorTecnico: jest.fn(),
    obtenerTodosReportes: jest.fn()
}));

const { ValidationError } = require('sequelize');
const { ClienteModel } = require('../../../src/models/cliente.model.js');
const { TecnicoModel } = require('../../../src/models/tecnico.model.js');
const { generarPDFReporte } = require('../../../src/services/reporte_mantenimiento.services.js');
const { sendEmail } = require('../../../src/services/email.services.js');
const reporteRepo = require('../../../src/repository/reporte_mantenimiento.repository.js');
const controller = require('../../../src/controllers/reporte_mantenimiento.controller.js');

describe('Reporte Mantenimiento Controller', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockReq = {
            body: {},
            params: {},
            query: {},
            user: null
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            download: jest.fn((path, filename, callback) => callback && callback())
        };
    });

    describe('crearReporteMantenimiento', () => {
        const mockReporteData = {
            fecha: '2025-01-15',
            id_cliente: 1,
            id_tecnico: 2,
            direccion: 'Calle 123',
            ciudad: 'Bogotá',
            encargado: 'Juan Pérez',
            marca_generador: 'Caterpillar',
            modelo_generador: 'C15',
            parametros_operacion: [{
                presion_aceite: '50 PSI',
                temperatura_aceite: '80°C'
            }],
            verificaciones: [
                { item: 'Nivel de aceite', visto: true, observacion: 'OK' }
            ]
        };

        it('debería crear un reporte exitosamente', async () => {
            mockReq.body = mockReporteData;

            const mockReporte = { id: 1, ...mockReporteData };
            const mockCliente = { nombre: 'Empresa Test', telefono: '3001234567', correo_electronico: 'cliente@test.com' };
            const mockTecnico = { nombre: 'Carlos', apellido: 'Técnico', telefono: '3009876543', correo_electronico: 'tecnico@test.com' };

            reporteRepo.crearReporte.mockResolvedValue(mockReporte);
            reporteRepo.crearParametrosOperacion.mockResolvedValue({ id: 1 });
            reporteRepo.crearVerificaciones.mockResolvedValue([{ id: 1 }]);
            ClienteModel.Cliente.findByPk.mockResolvedValue(mockCliente);
            TecnicoModel.Tecnico.findByPk.mockResolvedValue(mockTecnico);
            generarPDFReporte.mockResolvedValue('uploads/reportes/test.pdf');
            sendEmail.mockResolvedValue(true);

            await controller.crearReporteMantenimiento(mockReq, mockRes);

            expect(reporteRepo.crearReporte).toHaveBeenCalled();
            expect(ClienteModel.Cliente.findByPk).toHaveBeenCalledWith(1);
            expect(TecnicoModel.Tecnico.findByPk).toHaveBeenCalledWith(2);
            expect(generarPDFReporte).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                mensaje: expect.any(String),
                reporte: expect.any(Object)
            }));
        });

        it('debería retornar 400 si no se proporciona id_cliente', async () => {
            mockReq.body = { ...mockReporteData, id_cliente: null };

            await controller.crearReporteMantenimiento(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'El ID del cliente es requerido'
            });
        });

        it('debería retornar 404 si el cliente no existe', async () => {
            mockReq.body = mockReporteData;

            reporteRepo.crearReporte.mockResolvedValue({ id: 1 });
            reporteRepo.crearParametrosOperacion.mockResolvedValue({ id: 1 });
            reporteRepo.crearVerificaciones.mockResolvedValue([{ id: 1 }]);
            ClienteModel.Cliente.findByPk.mockResolvedValue(null);

            await controller.crearReporteMantenimiento(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
        });

        it('debería retornar 404 si el técnico no existe', async () => {
            mockReq.body = mockReporteData;

            reporteRepo.crearReporte.mockResolvedValue({ id: 1 });
            reporteRepo.crearParametrosOperacion.mockResolvedValue({ id: 1 });
            reporteRepo.crearVerificaciones.mockResolvedValue([{ id: 1 }]);
            ClienteModel.Cliente.findByPk.mockResolvedValue({ nombre: 'Test' });
            TecnicoModel.Tecnico.findByPk.mockResolvedValue(null);

            await controller.crearReporteMantenimiento(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Técnico no encontrado' });
        });

        it('debería manejar errores de validación de Sequelize', async () => {
            mockReq.body = mockReporteData;

            const validationError = new ValidationError('Error de validación', [
                { path: 'marca_generador', message: 'La marca es requerida' }
            ]);

            reporteRepo.crearReporte.mockRejectedValue(validationError);

            await controller.crearReporteMantenimiento(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                errors: expect.arrayContaining([
                    expect.objectContaining({ path: 'marca_generador' })
                ])
            });
        });

        it('debería continuar si falla el envío de email', async () => {
            mockReq.body = mockReporteData;

            const mockReporte = { id: 1, ...mockReporteData };
            const mockCliente = { nombre: 'Empresa Test', telefono: '3001234567', correo_electronico: 'cliente@test.com' };
            const mockTecnico = { nombre: 'Carlos', apellido: 'Técnico', telefono: '3009876543', correo_electronico: 'tecnico@test.com' };

            reporteRepo.crearReporte.mockResolvedValue(mockReporte);
            reporteRepo.crearParametrosOperacion.mockResolvedValue({ id: 1 });
            reporteRepo.crearVerificaciones.mockResolvedValue([{ id: 1 }]);
            ClienteModel.Cliente.findByPk.mockResolvedValue(mockCliente);
            TecnicoModel.Tecnico.findByPk.mockResolvedValue(mockTecnico);
            generarPDFReporte.mockResolvedValue('uploads/reportes/test.pdf');
            sendEmail.mockRejectedValue(new Error('Email service error'));

            await controller.crearReporteMantenimiento(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
        });

        it('debería manejar errores generales con código 500', async () => {
            mockReq.body = mockReporteData;

            reporteRepo.crearReporte.mockRejectedValue(new Error('Database error'));

            await controller.crearReporteMantenimiento(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Error al crear el reporte de mantenimiento'
            }));
        });
    });

    describe('listarReportes', () => {
        it('debería listar todos los reportes para admin', async () => {
            mockReq.user = { id: 1, rol: 'admin' };

            const mockReportes = [{ id: 1 }, { id: 2 }];
            reporteRepo.obtenerTodosReportes.mockResolvedValue(mockReportes);

            await controller.listarReportes(mockReq, mockRes);

            expect(reporteRepo.obtenerTodosReportes).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                total: 2,
                reportes: mockReportes
            }));
        });

        it('debería listar reportes del cliente específico', async () => {
            mockReq.user = { id: 5, rol: 'cliente' };

            const mockReportes = [{ id: 1, id_cliente: 5 }];
            reporteRepo.obtenerReportesPorCliente.mockResolvedValue(mockReportes);

            await controller.listarReportes(mockReq, mockRes);

            expect(reporteRepo.obtenerReportesPorCliente).toHaveBeenCalledWith(5);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('debería listar reportes del técnico específico', async () => {
            mockReq.user = { id: 3, rol: 'tecnico' };

            const mockReportes = [{ id: 1, id_tecnico: 3 }];
            reporteRepo.obtenerReportesPorTecnico.mockResolvedValue(mockReportes);

            await controller.listarReportes(mockReq, mockRes);

            expect(reporteRepo.obtenerReportesPorTecnico).toHaveBeenCalledWith(3);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('debería retornar 401 si no hay usuario autenticado', async () => {
            mockReq.user = null;

            await controller.listarReportes(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuario no autenticado' });
        });

        it('debería retornar 403 para roles no autorizados', async () => {
            mockReq.user = { id: 1, rol: 'contador' };

            await controller.listarReportes(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'No tiene permisos para listar reportes' });
        });

        it('debería manejar errores con código 500', async () => {
            mockReq.user = { id: 1, rol: 'admin' };

            reporteRepo.obtenerTodosReportes.mockRejectedValue(new Error('DB error'));

            await controller.listarReportes(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });

    describe('obtenerReportePorId', () => {
        it('debería obtener un reporte por ID para admin', async () => {
            mockReq.params = { id: 1 };
            mockReq.user = { id: 1, rol: 'admin' };

            const mockReporte = { id: 1, id_cliente: 5, id_tecnico: 3 };
            reporteRepo.obtenerReportePorId.mockResolvedValue(mockReporte);

            await controller.obtenerReportePorId(mockReq, mockRes);

            expect(reporteRepo.obtenerReportePorId).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                reporte: mockReporte
            }));
        });

        it('debería retornar 404 si el reporte no existe', async () => {
            mockReq.params = { id: 999 };
            mockReq.user = { id: 1, rol: 'admin' };

            reporteRepo.obtenerReportePorId.mockResolvedValue(null);

            await controller.obtenerReportePorId(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Reporte no encontrado' });
        });

        it('debería retornar 403 si el cliente intenta ver reporte de otro cliente', async () => {
            mockReq.params = { id: 1 };
            mockReq.user = { id: 10, rol: 'cliente' };

            const mockReporte = { id: 1, id_cliente: 5, id_tecnico: 3 };
            reporteRepo.obtenerReportePorId.mockResolvedValue(mockReporte);

            await controller.obtenerReportePorId(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'No tiene permisos para ver este reporte' });
        });

        it('debería retornar 403 si el técnico intenta ver reporte de otro técnico', async () => {
            mockReq.params = { id: 1 };
            mockReq.user = { id: 10, rol: 'tecnico' };

            const mockReporte = { id: 1, id_cliente: 5, id_tecnico: 3 };
            reporteRepo.obtenerReportePorId.mockResolvedValue(mockReporte);

            await controller.obtenerReportePorId(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'No tiene permisos para ver este reporte' });
        });

        it('debería permitir que el cliente vea su propio reporte', async () => {
            mockReq.params = { id: 1 };
            mockReq.user = { id: 5, rol: 'cliente' };

            const mockReporte = { id: 1, id_cliente: 5, id_tecnico: 3 };
            reporteRepo.obtenerReportePorId.mockResolvedValue(mockReporte);

            await controller.obtenerReportePorId(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
    });

    describe('descargarPDF', () => {
        it('debería descargar el PDF del reporte', async () => {
            mockReq.params = { id: 1 };
            mockReq.user = { id: 1, rol: 'admin' };

            const mockReporte = {
                id: 1,
                id_cliente: 5,
                id_tecnico: 3,
                parametros: [],
                verificaciones: []
            };
            const mockCliente = { nombre: 'Test', telefono: '123', correo_electronico: 'test@test.com' };
            const mockTecnico = { nombre: 'Tec', apellido: 'Test', telefono: '456', correo_electronico: 'tec@test.com' };

            reporteRepo.obtenerReportePorId.mockResolvedValue(mockReporte);
            ClienteModel.Cliente.findByPk.mockResolvedValue(mockCliente);
            TecnicoModel.Tecnico.findByPk.mockResolvedValue(mockTecnico);
            generarPDFReporte.mockResolvedValue('uploads/reportes/test.pdf');

            await controller.descargarPDF(mockReq, mockRes);

            expect(generarPDFReporte).toHaveBeenCalled();
            expect(mockRes.download).toHaveBeenCalledWith(
                'uploads/reportes/test.pdf',
                'reporte_mantenimiento_1.pdf',
                expect.any(Function)
            );
        });

        it('debería retornar 404 si no se encuentra información del cliente o técnico', async () => {
            mockReq.params = { id: 1 };
            mockReq.user = { id: 1, rol: 'admin' };

            const mockReporte = { id: 1, id_cliente: 5, id_tecnico: 3 };

            reporteRepo.obtenerReportePorId.mockResolvedValue(mockReporte);
            ClienteModel.Cliente.findByPk.mockResolvedValue(null);

            await controller.descargarPDF(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Información del reporte no encontrada' });
        });

        it('debería manejar errores al descargar con código 500', async () => {
            mockReq.params = { id: 1 };
            mockReq.user = { id: 1, rol: 'admin' };

            reporteRepo.obtenerReportePorId.mockRejectedValue(new Error('DB error'));

            await controller.descargarPDF(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });
});
