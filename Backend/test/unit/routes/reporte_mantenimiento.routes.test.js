// Mocks ANTES de imports
jest.mock('../../../src/controllers/reporte_mantenimiento.controller.js', () => ({
    crearReporteMantenimiento: jest.fn(),
    listarReportes: jest.fn(),
    obtenerReportePorId: jest.fn(),
    descargarPDF: jest.fn()
}));

jest.mock('../../../src/middlewares/autenticacion.js', () => ({
    authenticate: jest.fn((req, res, next) => next()),
    isAdminOrTecnico: jest.fn((req, res, next) => next()),
    isCliente: jest.fn((req, res, next) => next())
}));

jest.mock('express', () => {
    const mockRouter = {
        post: jest.fn(),
        get: jest.fn()
    };

    return {
        Router: jest.fn(() => mockRouter)
    };
});

const express = require('express');
const controller = require('../../../src/controllers/reporte_mantenimiento.controller.js');
const { authenticate, isAdminOrTecnico, isCliente } = require('../../../src/middlewares/autenticacion.js');

describe('Reporte Mantenimiento Routes', () => {
    let mockRouter;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        
        // Reconfigurar el mock del router
        mockRouter = {
            post: jest.fn(),
            get: jest.fn()
        };
        express.Router.mockReturnValue(mockRouter);
        
        // Requiere el módulo de rutas para que se ejecuten las configuraciones
        require('../../../src/routers/reporte_mantenimiento.routes.js');
    });

    describe('POST /reportes-mantenimiento', () => {
        it('debería tener configurada la ruta con middlewares correctos', () => {
            expect(mockRouter.post).toHaveBeenCalledWith(
                '/reportes-mantenimiento',
                authenticate,
                isAdminOrTecnico,
                controller.crearReporteMantenimiento
            );
        });
    });

    describe('GET /reportes-mantenimiento', () => {
        it('debería tener configurada la ruta para listar reportes', () => {
            expect(mockRouter.get).toHaveBeenCalledWith(
                '/reportes-mantenimiento',
                authenticate,
                isAdminOrTecnico,
                controller.listarReportes
            );
        });
    });

    describe('GET /reportes-mantenimiento/:id', () => {
        it('debería tener configurada la ruta para obtener reporte por ID', () => {
            expect(mockRouter.get).toHaveBeenCalledWith(
                '/reportes-mantenimiento/:id',
                authenticate,
                isAdminOrTecnico,
                controller.obtenerReportePorId
            );
        });
    });

    describe('GET /reportes-mantenimiento/:id/pdf', () => {
        it('debería tener configurada la ruta para descargar PDF', () => {
            expect(mockRouter.get).toHaveBeenCalledWith(
                '/reportes-mantenimiento/:id/pdf',
                authenticate,
                isAdminOrTecnico,
                controller.descargarPDF
            );
        });
    });

    describe('GET /descargar/:nombreArchivo', () => {
        it('debería tener configurada la ruta para descargar archivo por nombre', () => {
            const calls = mockRouter.get.mock.calls;
            const descargarCall = calls.find(call => call[0] === '/descargar/:nombreArchivo');
            
            expect(descargarCall).toBeDefined();
            expect(descargarCall[1]).toBe(authenticate);
            expect(descargarCall[2]).toBe(isCliente);
            expect(descargarCall[3]).toBeInstanceOf(Function);
        });
    });

    describe('Verificación de middlewares', () => {
        it('todas las rutas deben tener authenticate como primer middleware', () => {
            const postCalls = mockRouter.post.mock.calls;
            const getCalls = mockRouter.get.mock.calls;
            const allCalls = [...postCalls, ...getCalls];

            allCalls.forEach(call => {
                expect(call[1]).toBe(authenticate);
            });
        });

        it('rutas de admin/tecnico deben tener isAdminOrTecnico', () => {
            const adminTecnicoCalls = mockRouter.post.mock.calls.concat(
                mockRouter.get.mock.calls.filter(call => 
                    call[0].includes('/reportes-mantenimiento')
                )
            );

            adminTecnicoCalls.forEach(call => {
                if (!call[0].includes('/descargar/')) {
                    expect(call[2]).toBe(isAdminOrTecnico);
                }
            });
        });

        it('ruta de descarga directa debe tener isCliente', () => {
            const calls = mockRouter.get.mock.calls;
            const descargarCall = calls.find(call => call[0] === '/descargar/:nombreArchivo');
            
            expect(descargarCall[2]).toBe(isCliente);
        });
    });

    describe('Estructura de rutas', () => {
        it('debe tener exactamente 5 rutas configuradas', () => {
            const totalRoutes = mockRouter.post.mock.calls.length + mockRouter.get.mock.calls.length;
            expect(totalRoutes).toBe(5);
        });

        it('debe tener 1 ruta POST', () => {
            expect(mockRouter.post).toHaveBeenCalledTimes(1);
        });

        it('debe tener 4 rutas GET', () => {
            expect(mockRouter.get).toHaveBeenCalledTimes(4);
        });
    });

    describe('Controladores asignados', () => {
        it('ruta POST debe llamar a crearReporteMantenimiento', () => {
            const postCall = mockRouter.post.mock.calls[0];
            expect(postCall[3]).toBe(controller.crearReporteMantenimiento);
        });

        it('ruta GET lista debe llamar a listarReportes', () => {
            const listCall = mockRouter.get.mock.calls.find(
                call => call[0] === '/reportes-mantenimiento'
            );
            expect(listCall[3]).toBe(controller.listarReportes);
        });

        it('ruta GET por ID debe llamar a obtenerReportePorId', () => {
            const getByIdCall = mockRouter.get.mock.calls.find(
                call => call[0] === '/reportes-mantenimiento/:id'
            );
            expect(getByIdCall[3]).toBe(controller.obtenerReportePorId);
        });

        it('ruta GET PDF debe llamar a descargarPDF', () => {
            const pdfCall = mockRouter.get.mock.calls.find(
                call => call[0] === '/reportes-mantenimiento/:id/pdf'
            );
            expect(pdfCall[3]).toBe(controller.descargarPDF);
        });
    });
});
