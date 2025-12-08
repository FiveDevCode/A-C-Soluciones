// Mocks ANTES de los imports
jest.mock('../../../src/models/reporte_mantenimiento.model.js', () => ({
    ReporteMantenimientoModel: {
        ReporteMantenimientoPlantasElectricas: {
            create: jest.fn(),
            findByPk: jest.fn(),
            findAll: jest.fn()
        },
        ParametrosOperacion: {
            create: jest.fn()
        },
        VerificacionMantenimiento: {
            bulkCreate: jest.fn()
        }
    }
}));

const { ReporteMantenimientoModel } = require('../../../src/models/reporte_mantenimiento.model.js');
const reporteRepo = require('../../../src/repository/reporte_mantenimiento.repository.js');

describe('Reporte Mantenimiento Repository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('crearReporte', () => {
        it('debería crear un reporte con los datos proporcionados', async () => {
            const mockData = {
                fecha: new Date(),
                id_cliente: 1,
                id_tecnico: 2,
                direccion: 'Calle 123',
                ciudad: 'Bogotá',
                encargado: 'Juan Pérez',
                marca_generador: 'Caterpillar',
                modelo_generador: 'C15'
            };

            const mockReporte = { id: 1, ...mockData };
            ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.create.mockResolvedValue(mockReporte);

            const resultado = await reporteRepo.crearReporte(mockData);

            expect(ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.create).toHaveBeenCalledWith(mockData);
            expect(resultado).toEqual(mockReporte);
        });
    });

    describe('crearParametrosOperacion', () => {
        it('debería crear parámetros de operación', async () => {
            const mockData = {
                reporte_id: 1,
                presion_aceite: '50 PSI',
                temperatura_aceite: '80°C',
                fugas_aceite: false
            };

            const mockParametros = { id: 1, ...mockData };
            ReporteMantenimientoModel.ParametrosOperacion.create.mockResolvedValue(mockParametros);

            const resultado = await reporteRepo.crearParametrosOperacion(mockData);

            expect(ReporteMantenimientoModel.ParametrosOperacion.create).toHaveBeenCalledWith(mockData);
            expect(resultado).toEqual(mockParametros);
        });
    });

    describe('crearVerificaciones', () => {
        it('debería crear verificaciones en bulk', async () => {
            const mockVerificaciones = [
                { reporte_id: 1, item: 'Nivel de aceite', visto: true, observacion: 'OK' },
                { reporte_id: 1, item: 'Filtros', visto: true, observacion: 'Cambiados' }
            ];

            ReporteMantenimientoModel.VerificacionMantenimiento.bulkCreate.mockResolvedValue(mockVerificaciones);

            const resultado = await reporteRepo.crearVerificaciones(mockVerificaciones);

            expect(ReporteMantenimientoModel.VerificacionMantenimiento.bulkCreate).toHaveBeenCalledWith(mockVerificaciones);
            expect(resultado).toEqual(mockVerificaciones);
        });
    });

    describe('obtenerReportePorId', () => {
        it('debería obtener un reporte por ID con sus relaciones', async () => {
            const mockReporte = {
                id: 1,
                fecha: new Date(),
                parametros: [{ id: 1, presion_aceite: '50 PSI' }],
                verificaciones: [{ id: 1, item: 'Nivel de aceite' }]
            };

            ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.findByPk.mockResolvedValue(mockReporte);

            const resultado = await reporteRepo.obtenerReportePorId(1);

            expect(ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.findByPk).toHaveBeenCalledWith(1, {
                include: [
                    {
                        model: ReporteMantenimientoModel.ParametrosOperacion,
                        as: 'parametros'
                    },
                    {
                        model: ReporteMantenimientoModel.VerificacionMantenimiento,
                        as: 'verificaciones'
                    }
                ]
            });
            expect(resultado).toEqual(mockReporte);
        });
    });

    describe('obtenerReportesPorCliente', () => {
        it('debería obtener reportes filtrados por cliente', async () => {
            const mockReportes = [
                { id: 1, id_cliente: 1, fecha: new Date() },
                { id: 2, id_cliente: 1, fecha: new Date() }
            ];

            ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.findAll.mockResolvedValue(mockReportes);

            const resultado = await reporteRepo.obtenerReportesPorCliente(1);

            expect(ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.findAll).toHaveBeenCalledWith({
                where: { id_cliente: 1 },
                include: expect.any(Array),
                order: [['fecha', 'DESC']]
            });
            expect(resultado).toEqual(mockReportes);
        });
    });

    describe('obtenerReportesPorTecnico', () => {
        it('debería obtener reportes filtrados por técnico', async () => {
            const mockReportes = [
                { id: 1, id_tecnico: 2, fecha: new Date() },
                { id: 2, id_tecnico: 2, fecha: new Date() }
            ];

            ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.findAll.mockResolvedValue(mockReportes);

            const resultado = await reporteRepo.obtenerReportesPorTecnico(2);

            expect(ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.findAll).toHaveBeenCalledWith({
                where: { id_tecnico: 2 },
                include: expect.any(Array),
                order: [['fecha', 'DESC']]
            });
            expect(resultado).toEqual(mockReportes);
        });
    });

    describe('obtenerTodosReportes', () => {
        it('debería obtener todos los reportes ordenados por fecha', async () => {
            const mockReportes = [
                { id: 1, fecha: new Date('2025-01-02') },
                { id: 2, fecha: new Date('2025-01-01') }
            ];

            ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.findAll.mockResolvedValue(mockReportes);

            const resultado = await reporteRepo.obtenerTodosReportes();

            expect(ReporteMantenimientoModel.ReporteMantenimientoPlantasElectricas.findAll).toHaveBeenCalledWith({
                include: expect.any(Array),
                order: [['fecha', 'DESC']]
            });
            expect(resultado).toEqual(mockReportes);
        });
    });
});
