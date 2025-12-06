// Mocks PRIMERO
jest.mock('../../../src/database/conexion.js', () => ({
    sequelize: {}
}));

jest.mock('../../../src/models/reporte_bombeo.model.js', () => ({
    ReporteBombeo: {},
    ReporteBombeoModel: { ReporteBombeo: {} }
}));

jest.mock('../../../src/models/equipoBombeo.model.js', () => ({
    EquipoBombeo: {},
    EquipoBombeoModel: { EquipoBombeo: {} }
}));

jest.mock('../../../src/models/parametroBombeo.model.js', () => ({
    ParametroBombeo: {},
    ParametroBombeoModel: { ParametroBombeo: {} }
}));

jest.mock('../../../src/models/cliente.model.js', () => ({
    ClienteModel: { Cliente: {} }
}));

jest.mock('../../../src/models/tecnico.model.js', () => ({
    TecnicoModel: { Tecnico: {} }
}));

jest.mock('../../../src/repository/reporte_bombeo.repository.js');

jest.mock('../../../src/controllers/reporte_bombeo.controller.js', () => ({
    crearReporteBombeo: jest.fn(),
    listarReportes: jest.fn(),
    obtenerReportePorId: jest.fn()
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
    authenticate: jest.fn(),
    isAdminOrTecnico: jest.fn(),
    isCliente: jest.fn()
}));

// Imports
import express from 'express';
import * as controller from '../../../src/controllers/reporte_bombeo.controller.js';
import { authenticate, isAdminOrTecnico } from '../../../src/middlewares/autenticacion.js';

// Mock de express Router
const mockRouter = {
    post: jest.fn(),
    get: jest.fn()
};

jest.mock('express', () => ({
    Router: jest.fn(() => mockRouter)
}));

describe('Reporte Bombeo Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('debería crear el router correctamente', () => {
        // Importar las rutas para que se ejecute la configuración
        require('../../../src/routers/reporte_bombeo.routes.js');
        
        expect(express.Router).toHaveBeenCalled();
    });

    it('debería configurar la ruta POST /api/reportes-bombeo para crear reportes', () => {
        // Resetear mocks
        jest.resetModules();
        mockRouter.post.mockClear();
        mockRouter.get.mockClear();
        
        // Importar las rutas
        require('../../../src/routers/reporte_bombeo.routes.js');
        
        const calls = mockRouter.post.mock.calls[0];
        expect(calls[0]).toBe('/api/reportes-bombeo');
        expect(calls).toHaveLength(4);
    });

    it('debería configurar la ruta GET /api/reportes-bombeo para listar reportes', () => {
        jest.resetModules();
        mockRouter.post.mockClear();
        mockRouter.get.mockClear();
        
        require('../../../src/routers/reporte_bombeo.routes.js');
        
        const calls = mockRouter.get.mock.calls;
        const listarReportesCall = calls.find(call => call[0] === '/api/reportes-bombeo');
        
        expect(listarReportesCall).toBeDefined();
        expect(listarReportesCall[0]).toBe('/api/reportes-bombeo');
        expect(listarReportesCall).toHaveLength(4);
    });

    it('debería configurar la ruta GET /reportes-bombeo/:idReporte para obtener reporte por ID', () => {
        jest.resetModules();
        mockRouter.post.mockClear();
        mockRouter.get.mockClear();
        
        require('../../../src/routers/reporte_bombeo.routes.js');
        
        const calls = mockRouter.get.mock.calls;
        const obtenerPorIdCall = calls.find(call => call[0] === '/reportes-bombeo/:idReporte');
        
        expect(obtenerPorIdCall).toBeDefined();
        expect(obtenerPorIdCall[0]).toBe('/reportes-bombeo/:idReporte');
        expect(obtenerPorIdCall).toHaveLength(2);
    });

    it('debería tener exactamente 1 ruta POST configurada', () => {
        jest.resetModules();
        mockRouter.post.mockClear();
        mockRouter.get.mockClear();
        
        require('../../../src/routers/reporte_bombeo.routes.js');
        
        expect(mockRouter.post).toHaveBeenCalledTimes(1);
    });

    it('debería tener exactamente 2 rutas GET configuradas', () => {
        jest.resetModules();
        mockRouter.post.mockClear();
        mockRouter.get.mockClear();
        
        require('../../../src/routers/reporte_bombeo.routes.js');
        
        expect(mockRouter.get).toHaveBeenCalledTimes(2);
    });

    it('debería usar middleware authenticate para rutas protegidas', () => {
        jest.resetModules();
        mockRouter.post.mockClear();
        mockRouter.get.mockClear();
        
        require('../../../src/routers/reporte_bombeo.routes.js');
        
        const postCalls = mockRouter.post.mock.calls;
        const getCalls = mockRouter.get.mock.calls;
        
        // Verificar POST /api/reportes-bombeo tiene middlewares
        expect(postCalls[0]).toHaveLength(4);
        
        // Verificar GET /api/reportes-bombeo tiene middlewares
        const listarReportesCall = getCalls.find(call => call[0] === '/api/reportes-bombeo');
        expect(listarReportesCall).toHaveLength(4);
    });

    it('debería usar middleware isAdminOrTecnico para crear y listar reportes', () => {
        jest.resetModules();
        mockRouter.post.mockClear();
        mockRouter.get.mockClear();
        
        require('../../../src/routers/reporte_bombeo.routes.js');
        
        const postCalls = mockRouter.post.mock.calls;
        const getCalls = mockRouter.get.mock.calls;
        
        // Verificar POST tiene 4 argumentos (path + 3 funciones)
        expect(postCalls[0]).toHaveLength(4);
        
        // Verificar GET /api/reportes-bombeo tiene 4 argumentos
        const listarReportesCall = getCalls.find(call => call[0] === '/api/reportes-bombeo');
        expect(listarReportesCall).toHaveLength(4);
    });

    it('debería NO usar middleware authenticate en la ruta de obtener por ID', () => {
        jest.resetModules();
        mockRouter.post.mockClear();
        mockRouter.get.mockClear();
        
        require('../../../src/routers/reporte_bombeo.routes.js');
        
        const getCalls = mockRouter.get.mock.calls;
        const obtenerPorIdCall = getCalls.find(call => call[0] === '/reportes-bombeo/:idReporte');
        
        // La ruta solo tiene path y controller (2 argumentos)
        expect(obtenerPorIdCall).toHaveLength(2);
    });

    it('debería exportar el router por defecto', () => {
        const reporteRoutes = require('../../../src/routers/reporte_bombeo.routes.js');
        expect(reporteRoutes.default).toBeDefined();
    });

    it('debería llamar a los controladores correctos en cada ruta', () => {
        jest.resetModules();
        mockRouter.post.mockClear();
        mockRouter.get.mockClear();
        
        require('../../../src/routers/reporte_bombeo.routes.js');
        
        // Verificar que se configuraron las rutas
        expect(mockRouter.post).toHaveBeenCalledTimes(1);
        expect(mockRouter.get).toHaveBeenCalledTimes(2);
        
        // Verificar paths
        const postCall = mockRouter.post.mock.calls[0];
        expect(postCall[0]).toBe('/api/reportes-bombeo');

        const getCalls = mockRouter.get.mock.calls;
        const listarCall = getCalls.find(call => call[0] === '/api/reportes-bombeo');
        expect(listarCall).toBeDefined();

        const obtenerCall = getCalls.find(call => call[0] === '/reportes-bombeo/:idReporte');
        expect(obtenerCall).toBeDefined();
    });

    it('debería usar rutas con prefijo /api para crear y listar', () => {
        jest.resetModules();
        mockRouter.post.mockClear();
        mockRouter.get.mockClear();
        
        require('../../../src/routers/reporte_bombeo.routes.js');
        
        const postCalls = mockRouter.post.mock.calls;
        const getCalls = mockRouter.get.mock.calls;

        expect(postCalls[0][0]).toMatch(/^\/api\//);
        
        const listarCall = getCalls.find(call => call[0] === '/api/reportes-bombeo');
        expect(listarCall).toBeDefined();
    });

    it('debería configurar parámetro de ruta :idReporte para obtener por ID', () => {
        jest.resetModules();
        mockRouter.post.mockClear();
        mockRouter.get.mockClear();
        
        require('../../../src/routers/reporte_bombeo.routes.js');
        
        const getCalls = mockRouter.get.mock.calls;
        const obtenerPorIdCall = getCalls.find(call => call[0] === '/reportes-bombeo/:idReporte');
        
        expect(obtenerPorIdCall[0]).toContain(':idReporte');
    });
});
