import * as controller from '../../../src/controllers/reporte_bombeo.controller.js';
import * as reporteRepo from '../../../src/repository/reporte_bombeo.repository.js';
import { generarPDFReporteBombeo } from '../../../src/services/reporte_bombeo.services.js';
import { sendEmail } from '../../../src/services/email.services.js';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { TecnicoModel } from '../../../src/models/tecnico.model.js';
import { ValidationError } from 'sequelize';

// Mocks
jest.mock('../../../src/repository/reporte_bombeo.repository.js');
jest.mock('../../../src/services/reporte_bombeo.services.js');
jest.mock('../../../src/services/email.services.js');
jest.mock('../../../src/models/cliente.model.js');
jest.mock('../../../src/models/tecnico.model.js');

describe('Reporte Bombeo Controller', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            body: {},
            query: {},
            params: {},
            user: null
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('crearReporteBombeo', () => {
        const mockRequestBody = {
            fecha: '2024-12-06',
            cliente_id: 1,
            tecnico_id: 2,
            administrador_id: 3,
            visita_id: null,
            direccion: 'Calle 123',
            ciudad: 'Bogotá',
            telefono: '3001234567',
            encargado: 'Juan Pérez',
            observaciones_finales: 'Todo en orden',
            equipos: [
                { equipo: 'Bomba 1', marca: 'Marca A', amperaje: '10A', presion: '50PSI', temperatura: '25°C', estado: 'Bueno', observacion: 'OK' }
            ],
            parametrosLinea: {
                voltaje_linea: '220V',
                corriente_linea: '15A',
                presion_succion: '30PSI',
                presion_descarga: '70PSI',
                observaciones: 'Valores normales'
            }
        };

        const mockCliente = {
            id: 1,
            nombre: 'Empresa ABC',
            correo_electronico: 'cliente@example.com',
            tipo_cliente: 'fijo'
        };

        const mockTecnico = {
            id: 2,
            nombre: 'Carlos',
            apellido: 'García',
            identificacion: '1234567890'
        };

        const mockNuevoReporte = {
            id: 100,
            fecha: '2024-12-06',
            cliente_id: 1,
            tecnico_id: 2,
            toJSON: jest.fn().mockReturnValue({ id: 100, fecha: '2024-12-06' })
        };

        const mockReporteCompleto = {
            id: 100,
            equipos: [{ toJSON: jest.fn().mockReturnValue({ equipo: 'Bomba 1' }) }],
            parametrosLinea: { toJSON: jest.fn().mockReturnValue({ voltaje_linea: '220V' }) },
            toJSON: jest.fn().mockReturnValue({ id: 100 })
        };

        it('debería crear un reporte exitosamente para cliente fijo', async () => {
            req.body = mockRequestBody;

            ClienteModel.Cliente = {
                findByPk: jest.fn().mockResolvedValue(mockCliente)
            };

            TecnicoModel.Tecnico = {
                findByPk: jest.fn().mockResolvedValue(mockTecnico)
            };

            reporteRepo.crearReporteCompleto = jest.fn().mockResolvedValue(mockNuevoReporte);
            reporteRepo.obtenerReportePorId = jest.fn().mockResolvedValue(mockReporteCompleto);
            reporteRepo.actualizarPDFPath = jest.fn().mockResolvedValue();
            generarPDFReporteBombeo.mockResolvedValue('uploads/reportes_bombeo/reporte_123.pdf');
            sendEmail.mockResolvedValue();

            await controller.crearReporteBombeo(req, res);

            expect(ClienteModel.Cliente.findByPk).toHaveBeenCalledWith(1);
            expect(TecnicoModel.Tecnico.findByPk).toHaveBeenCalledWith(2);
            expect(reporteRepo.crearReporteCompleto).toHaveBeenCalled();
            expect(generarPDFReporteBombeo).toHaveBeenCalled();
            expect(reporteRepo.actualizarPDFPath).toHaveBeenCalledWith(100, 'uploads/reportes_bombeo/reporte_123.pdf');
            expect(sendEmail).toHaveBeenCalledWith(
                'cliente@example.com',
                'Reporte de Bombeo #100',
                'Adjunto encontrarás el reporte de mantenimiento de los equipos de bombeo.',
                'uploads/reportes_bombeo/reporte_123.pdf'
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                mensaje: 'Reporte de Bombeo creado correctamente y enviado al cliente.',
                reporte: expect.objectContaining({
                    pdf_path: 'uploads/reportes_bombeo/reporte_123.pdf'
                })
            }));
        });

        it('debería retornar error 400 si faltan datos requeridos', async () => {
            req.body = {
                fecha: '2024-12-06'
                // Faltan otros campos requeridos
            };

            await controller.crearReporteBombeo(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Faltan datos requeridos (fecha, cliente_id, tecnico_id, equipos, parametrosLinea).'
            });
        });

        it('debería retornar error 404 si el cliente no existe', async () => {
            req.body = mockRequestBody;

            ClienteModel.Cliente = {
                findByPk: jest.fn().mockResolvedValue(null)
            };

            await controller.crearReporteBombeo(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
        });

        it('debería retornar error 400 si cliente regular no tiene visita_id', async () => {
            req.body = { ...mockRequestBody, visita_id: null };

            const clienteRegular = { ...mockCliente, tipo_cliente: 'regular' };

            ClienteModel.Cliente = {
                findByPk: jest.fn().mockResolvedValue(clienteRegular)
            };

            await controller.crearReporteBombeo(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Los clientes regulares requieren una visita asociada. Por favor seleccione una visita.'
            });
        });

        it('debería retornar error 400 si cliente fijo tiene visita_id', async () => {
            req.body = { ...mockRequestBody, visita_id: 10 };

            ClienteModel.Cliente = {
                findByPk: jest.fn().mockResolvedValue(mockCliente)
            };

            await controller.crearReporteBombeo(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Los clientes fijos no requieren visitas. Este campo debe estar vacío.'
            });
        });

        it('debería retornar error 404 si el técnico no existe', async () => {
            req.body = mockRequestBody;

            ClienteModel.Cliente = {
                findByPk: jest.fn().mockResolvedValue(mockCliente)
            };

            TecnicoModel.Tecnico = {
                findByPk: jest.fn().mockResolvedValue(null)
            };

            reporteRepo.crearReporteCompleto = jest.fn().mockResolvedValue(mockNuevoReporte);

            await controller.crearReporteBombeo(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Técnico no encontrado para generar el PDF.' });
        });

        it('debería manejar errores de validación de Sequelize', async () => {
            req.body = mockRequestBody;

            ClienteModel.Cliente = {
                findByPk: jest.fn().mockResolvedValue(mockCliente)
            };

            const validationError = new ValidationError('Validation error', [
                { path: 'fecha', message: 'Fecha inválida' },
                { path: 'telefono', message: 'Teléfono muy largo' }
            ]);

            reporteRepo.crearReporteCompleto = jest.fn().mockRejectedValue(validationError);

            await controller.crearReporteBombeo(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                errors: [
                    { path: 'fecha', message: 'Fecha inválida' },
                    { path: 'telefono', message: 'Teléfono muy largo' }
                ]
            });
        });

        it('debería manejar errores internos del servidor', async () => {
            req.body = mockRequestBody;

            ClienteModel.Cliente = {
                findByPk: jest.fn().mockResolvedValue(mockCliente)
            };

            reporteRepo.crearReporteCompleto = jest.fn().mockRejectedValue(new Error('Database error'));

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

            await controller.crearReporteBombeo(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error interno al crear el reporte' });
            expect(consoleErrorSpy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });
    });

    describe('listarReportes', () => {
        it('debería listar todos los reportes para admin', async () => {
            req.user = { rol: 'admin', id: 1 };
            req.query = {};

            const mockReportes = [
                { id: 1, fecha: '2024-12-06' },
                { id: 2, fecha: '2024-12-05' }
            ];

            reporteRepo.obtenerTodosReportes = jest.fn().mockResolvedValue(mockReportes);

            await controller.listarReportes(req, res);

            expect(reporteRepo.obtenerTodosReportes).toHaveBeenCalledWith(undefined);
            expect(res.json).toHaveBeenCalledWith(mockReportes);
        });

        it('debería listar reportes filtrados por visita_id para admin', async () => {
            req.user = { rol: 'administrador', id: 1 };
            req.query = { visita_id: '10' };

            const mockReportes = [{ id: 1, visita_id: 10 }];

            reporteRepo.obtenerTodosReportes = jest.fn().mockResolvedValue(mockReportes);

            await controller.listarReportes(req, res);

            expect(reporteRepo.obtenerTodosReportes).toHaveBeenCalledWith('10');
            expect(res.json).toHaveBeenCalledWith(mockReportes);
        });

        it('debería listar todos los reportes para técnico', async () => {
            req.user = { rol: 'tecnico', id: 2 };
            req.query = {};

            const mockReportes = [{ id: 1, tecnico_id: 2 }];

            reporteRepo.obtenerTodosReportes = jest.fn().mockResolvedValue(mockReportes);

            await controller.listarReportes(req, res);

            expect(reporteRepo.obtenerTodosReportes).toHaveBeenCalledWith(undefined);
            expect(res.json).toHaveBeenCalledWith(mockReportes);
        });

        it('debería listar solo reportes del cliente para rol cliente', async () => {
            req.user = { rol: 'cliente', id: 5 };
            req.query = {};

            const mockReportes = [{ id: 1, cliente_id: 5 }];

            reporteRepo.obtenerReportesPorCliente = jest.fn().mockResolvedValue(mockReportes);

            await controller.listarReportes(req, res);

            expect(reporteRepo.obtenerReportesPorCliente).toHaveBeenCalledWith(5);
            expect(res.json).toHaveBeenCalledWith(mockReportes);
        });

        it('debería retornar error 401 si no hay usuario autenticado', async () => {
            req.user = null;

            await controller.listarReportes(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Usuario no autenticado.' });
        });

        it('debería retornar error 403 para rol no autorizado', async () => {
            req.user = { rol: 'invitado', id: 1 };

            await controller.listarReportes(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Rol no autorizado' });
        });

        it('debería manejar errores del servidor', async () => {
            req.user = { rol: 'admin', id: 1 };

            reporteRepo.obtenerTodosReportes = jest.fn().mockRejectedValue(new Error('Database error'));

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

            await controller.listarReportes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error interno al obtener reportes' });
            expect(consoleErrorSpy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });
    });

    describe('obtenerReportePorId', () => {
        it('debería obtener un reporte por ID exitosamente', async () => {
            req.params = { idReporte: '1' };

            const mockReporte = {
                id: 1,
                fecha: '2024-12-06',
                equipos: [],
                parametrosLinea: {}
            };

            reporteRepo.obtenerReportePorId = jest.fn().mockResolvedValue(mockReporte);

            await controller.obtenerReportePorId(req, res);

            expect(reporteRepo.obtenerReportePorId).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockReporte);
        });

        it('debería retornar error 404 si el reporte no existe', async () => {
            req.params = { idReporte: '999' };

            reporteRepo.obtenerReportePorId = jest.fn().mockResolvedValue(null);

            await controller.obtenerReportePorId(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ mensaje: 'Reporte no encontrado' });
        });

        it('debería manejar errores del servidor', async () => {
            req.params = { idReporte: '1' };

            reporteRepo.obtenerReportePorId = jest.fn().mockRejectedValue(new Error('Database error'));

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

            await controller.obtenerReportePorId(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error del servidor' });
            expect(consoleErrorSpy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });
    });
});
