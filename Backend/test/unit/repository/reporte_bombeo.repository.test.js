// Mocks PRIMERO, antes de cualquier import
jest.mock('../../../src/database/conexion.js', () => ({
    sequelize: {
        transaction: jest.fn()
    }
}));

jest.mock('../../../src/models/reporte_bombeo.model.js', () => ({
    ReporteBombeo: {
        findByPk: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    },
    ReporteBombeoModel: {
        ReporteBombeo: {}
    }
}));

jest.mock('../../../src/models/equipoBombeo.model.js', () => ({
    EquipoBombeo: {
        bulkCreate: jest.fn()
    },
    EquipoBombeoModel: {
        EquipoBombeo: {}
    }
}));

jest.mock('../../../src/models/parametroBombeo.model.js', () => ({
    ParametroBombeo: {
        create: jest.fn()
    },
    ParametroBombeoModel: {
        ParametroBombeo: {}
    }
}));

jest.mock('../../../src/models/cliente.model.js', () => ({
    ClienteModel: {
        Cliente: {}
    }
}));

jest.mock('../../../src/models/tecnico.model.js', () => ({
    TecnicoModel: {
        Tecnico: {}
    }
}));

jest.mock('../../../src/models/administrador.model.js', () => ({
    AdminModel: {
        Admin: {}
    }
}));

jest.mock('../../../src/models/visita.model.js', () => ({
    VisitaModel: {
        Visita: {}
    }
}));

// Ahora sí los imports
import * as reporteRepo from '../../../src/repository/reporte_bombeo.repository.js';
import { ReporteBombeo } from '../../../src/models/reporte_bombeo.model.js';
import { EquipoBombeo } from '../../../src/models/equipoBombeo.model.js';
import { ParametroBombeo } from '../../../src/models/parametroBombeo.model.js';
import { sequelize } from '../../../src/database/conexion.js';
import { ClienteModel } from '../../../src/models/cliente.model.js';
import { TecnicoModel } from '../../../src/models/tecnico.model.js';
import { AdminModel } from '../../../src/models/administrador.model.js';
import { VisitaModel } from '../../../src/models/visita.model.js';

describe('Reporte Bombeo Repository', () => {
    let mockTransaction;

    beforeEach(() => {
        jest.clearAllMocks();

        mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn()
        };

        sequelize.transaction = jest.fn((callback) => callback(mockTransaction));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('crearReporteCompleto', () => {
        it('debería crear un reporte completo con equipos y parámetros en una transacción', async () => {
            const mockReporteData = {
                fecha: '2024-12-06',
                cliente_id: 1,
                tecnico_id: 2,
                administrador_id: 3,
                direccion: 'Calle 123',
                ciudad: 'Bogotá',
                telefono: '3001234567',
                encargado: 'Juan Pérez',
                observaciones_finales: 'Todo en orden'
            };

            const mockEquipos = [
                { equipo: 'Bomba 1', marca: 'Marca A', amperaje: '10A', presion: '50PSI', temperatura: '25°C', estado: 'Bueno', observacion: 'OK' },
                { equipo: 'Bomba 2', marca: 'Marca B', amperaje: '12A', presion: '60PSI', temperatura: '30°C', estado: 'Regular', observacion: 'Revisar' }
            ];

            const mockParametros = {
                voltaje_linea: '220V',
                corriente_linea: '15A',
                presion_succion: '30PSI',
                presion_descarga: '70PSI',
                observaciones: 'Valores normales'
            };

            const mockNuevoReporte = { id: 100, ...mockReporteData };

            ReporteBombeo.create = jest.fn().mockResolvedValue(mockNuevoReporte);
            EquipoBombeo.bulkCreate = jest.fn().mockResolvedValue([]);
            ParametroBombeo.create = jest.fn().mockResolvedValue({});

            const result = await reporteRepo.crearReporteCompleto(mockReporteData, mockEquipos, mockParametros);

            expect(sequelize.transaction).toHaveBeenCalledWith(expect.any(Function));
            expect(ReporteBombeo.create).toHaveBeenCalledWith(mockReporteData, { transaction: mockTransaction });
            expect(EquipoBombeo.bulkCreate).toHaveBeenCalledWith(
                [
                    { ...mockEquipos[0], reporte_id: 100 },
                    { ...mockEquipos[1], reporte_id: 100 }
                ],
                { transaction: mockTransaction }
            );
            expect(ParametroBombeo.create).toHaveBeenCalledWith(
                { ...mockParametros, reporte_id: 100 },
                { transaction: mockTransaction }
            );
            expect(result).toEqual(mockNuevoReporte);
        });

        it('debería manejar errores en la transacción', async () => {
            const mockReporteData = { fecha: '2024-12-06', cliente_id: 1 };
            const mockEquipos = [];
            const mockParametros = {};

            ReporteBombeo.create = jest.fn().mockRejectedValue(new Error('Database error'));

            await expect(reporteRepo.crearReporteCompleto(mockReporteData, mockEquipos, mockParametros))
                .rejects
                .toThrow('Database error');

            expect(sequelize.transaction).toHaveBeenCalled();
        });
    });

    describe('obtenerReportePorId', () => {
        it('debería obtener un reporte por ID con todas las relaciones', async () => {
            const mockReporte = {
                id: 1,
                fecha: '2024-12-06',
                cliente_id: 1,
                equipos: [],
                parametrosLinea: {},
                cliente_reporte: {},
                tecnico_reporte: {},
                administrador_reporte: {},
                visita_reporte: {}
            };

            ReporteBombeo.findByPk = jest.fn().mockResolvedValue(mockReporte);

            const result = await reporteRepo.obtenerReportePorId(1);

            expect(ReporteBombeo.findByPk).toHaveBeenCalledWith(1, {
                include: [
                    { model: EquipoBombeo, as: 'equipos' },
                    { model: ParametroBombeo, as: 'parametrosLinea' },
                    { model: ClienteModel.Cliente, as: 'cliente_reporte' },
                    { model: TecnicoModel.Tecnico, as: 'tecnico_reporte' },
                    { model: AdminModel.Admin, as: 'administrador_reporte' },
                    { model: VisitaModel.Visita, as: 'visita_reporte' }
                ]
            });
            expect(result).toEqual(mockReporte);
        });

        it('debería retornar null si no encuentra el reporte', async () => {
            ReporteBombeo.findByPk = jest.fn().mockResolvedValue(null);

            const result = await reporteRepo.obtenerReportePorId(999);

            expect(result).toBeNull();
        });
    });

    describe('obtenerTodosReportes', () => {
        it('debería obtener todos los reportes sin filtro de visita_id', async () => {
            const mockReportes = [
                { id: 1, fecha: '2024-12-06', equipos: [], parametrosLinea: {} },
                { id: 2, fecha: '2024-12-05', equipos: [], parametrosLinea: {} }
            ];

            ReporteBombeo.findAll = jest.fn().mockResolvedValue(mockReportes);

            const result = await reporteRepo.obtenerTodosReportes();

            expect(ReporteBombeo.findAll).toHaveBeenCalledWith({
                where: {},
                order: [['fecha', 'DESC']],
                include: [
                    { model: EquipoBombeo, as: 'equipos' },
                    { model: ParametroBombeo, as: 'parametrosLinea' }
                ]
            });
            expect(result).toEqual(mockReportes);
        });

        it('debería obtener reportes filtrados por visita_id', async () => {
            const mockReportes = [
                { id: 1, visita_id: 10, fecha: '2024-12-06', equipos: [], parametrosLinea: {} }
            ];

            ReporteBombeo.findAll = jest.fn().mockResolvedValue(mockReportes);

            const result = await reporteRepo.obtenerTodosReportes(10);

            expect(ReporteBombeo.findAll).toHaveBeenCalledWith({
                where: { visita_id: 10 },
                order: [['fecha', 'DESC']],
                include: [
                    { model: EquipoBombeo, as: 'equipos' },
                    { model: ParametroBombeo, as: 'parametrosLinea' }
                ]
            });
            expect(result).toEqual(mockReportes);
        });

        it('debería retornar array vacío si no hay reportes', async () => {
            ReporteBombeo.findAll = jest.fn().mockResolvedValue([]);

            const result = await reporteRepo.obtenerTodosReportes();

            expect(result).toEqual([]);
        });
    });

    describe('obtenerReportesPorCliente', () => {
        it('debería obtener reportes de un cliente específico', async () => {
            const mockReportes = [
                { id: 1, cliente_id: 5, fecha: '2024-12-06', equipos: [], parametrosLinea: {} },
                { id: 2, cliente_id: 5, fecha: '2024-12-05', equipos: [], parametrosLinea: {} }
            ];

            ReporteBombeo.findAll = jest.fn().mockResolvedValue(mockReportes);

            const result = await reporteRepo.obtenerReportesPorCliente(5);

            expect(ReporteBombeo.findAll).toHaveBeenCalledWith({
                where: { cliente_id: 5 },
                order: [['fecha', 'DESC']],
                include: [
                    { model: EquipoBombeo, as: 'equipos' },
                    { model: ParametroBombeo, as: 'parametrosLinea' }
                ]
            });
            expect(result).toEqual(mockReportes);
        });

        it('debería retornar array vacío si el cliente no tiene reportes', async () => {
            ReporteBombeo.findAll = jest.fn().mockResolvedValue([]);

            const result = await reporteRepo.obtenerReportesPorCliente(999);

            expect(result).toEqual([]);
        });
    });

    describe('actualizarPDFPath', () => {
        it('debería actualizar la ruta del PDF correctamente', async () => {
            ReporteBombeo.update = jest.fn().mockResolvedValue([1]);

            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

            await reporteRepo.actualizarPDFPath(1, 'uploads/reportes_bombeo/reporte_123.pdf');

            expect(ReporteBombeo.update).toHaveBeenCalledWith(
                { pdf_path: 'uploads/reportes_bombeo/reporte_123.pdf' },
                { where: { id: 1 } }
            );
            expect(consoleWarnSpy).not.toHaveBeenCalled();

            consoleWarnSpy.mockRestore();
        });

        it('debería mostrar advertencia si no se encuentra el reporte', async () => {
            ReporteBombeo.update = jest.fn().mockResolvedValue([0]);

            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

            await reporteRepo.actualizarPDFPath(999, 'uploads/reportes_bombeo/reporte_999.pdf');

            expect(ReporteBombeo.update).toHaveBeenCalledWith(
                { pdf_path: 'uploads/reportes_bombeo/reporte_999.pdf' },
                { where: { id: 999 } }
            );
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                'No se encontró el reporte con ID 999 para actualizar la ruta del PDF.'
            );

            consoleWarnSpy.mockRestore();
        });
    });
});
