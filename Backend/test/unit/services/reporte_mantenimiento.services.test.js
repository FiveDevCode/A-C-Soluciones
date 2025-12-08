// Mocks ANTES de los imports
jest.mock('fs', () => ({
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    createWriteStream: jest.fn()
}));

jest.mock('pdfkit', () => {
    const mockDoc = {
        pipe: jest.fn(),
        fillColor: jest.fn().mockReturnThis(),
        fontSize: jest.fn().mockReturnThis(),
        font: jest.fn().mockReturnThis(),
        text: jest.fn().mockReturnThis(),
        moveDown: jest.fn().mockReturnThis(),
        strokeColor: jest.fn().mockReturnThis(),
        lineWidth: jest.fn().mockReturnThis(),
        moveTo: jest.fn().mockReturnThis(),
        lineTo: jest.fn().mockReturnThis(),
        stroke: jest.fn().mockReturnThis(),
        rect: jest.fn().mockReturnThis(),
        fillAndStroke: jest.fn().mockReturnThis(),
        addPage: jest.fn().mockReturnThis(),
        end: jest.fn(),
        y: 100,
        page: { width: 600 }
    };
    
    return {
        __esModule: true,
        default: jest.fn(() => mockDoc)
    };
});

jest.mock('crypto', () => ({
    randomBytes: jest.fn(() => ({
        toString: jest.fn(() => 'abc123def456')
    }))
}));

jest.mock('path', () => ({
    join: jest.fn((...args) => args.join('/'))
}));

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');
const { generarPDFReporte } = require('../../../src/services/reporte_mantenimiento.services.js');

describe('Reporte Mantenimiento Services', () => {
    let mockStream;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockStream = {
            on: jest.fn((event, callback) => {
                if (event === 'finish') {
                    setTimeout(callback, 0);
                }
                return mockStream;
            }),
            once: jest.fn(),
            emit: jest.fn()
        };

        fs.existsSync.mockReturnValue(true);
        fs.createWriteStream.mockReturnValue(mockStream);
    });

    describe('generarPDFReporte', () => {
        const mockReporte = {
            id: 1,
            fecha: new Date('2025-01-15'),
            id_cliente: 1,
            id_tecnico: 1,
            direccion: 'Calle 123 #45-67',
            ciudad: 'Bogotá',
            telefono: '3001234567',
            encargado: 'Juan Pérez',
            marca_generador: 'Caterpillar',
            modelo_generador: 'C15',
            kva: '500',
            serie_generador: 'CAT123456',
            observaciones_finales: 'Mantenimiento preventivo completado satisfactoriamente'
        };

        const mockClienteInfo = {
            nombre: 'Empresa Test',
            telefono: '3001234567',
            correo: 'cliente@test.com'
        };

        const mockTecnicoInfo = {
            nombre: 'Carlos',
            apellido: 'Técnico',
            telefono: '3009876543',
            correo: 'tecnico@test.com'
        };

        const mockParametros = [{
            presion_aceite: '50 PSI',
            temperatura_aceite: '80°C',
            temperatura_refrigerante: '85°C',
            fugas_aceite: false,
            fugas_combustible: false,
            frecuencia_rpm: '1800 RPM',
            voltaje_salida: '220V'
        }];

        const mockVerificaciones = [
            { item: 'Nivel de aceite', visto: true, observacion: 'OK' },
            { item: 'Filtros', visto: true, observacion: 'Cambiados' },
            { item: 'Baterías', visto: false, observacion: 'Requiere cambio' }
        ];

        it('debería generar un PDF con toda la información del reporte', async () => {
            const pdfPath = await generarPDFReporte(
                mockReporte,
                mockClienteInfo,
                mockTecnicoInfo,
                mockParametros,
                mockVerificaciones
            );

            expect(PDFDocument).toHaveBeenCalledWith({ margin: 50 });
            expect(pdfPath).toContain('reporte_mantenimiento_abc123def456.pdf');
        });

        it('debería crear el directorio si no existe', async () => {
            fs.existsSync.mockReturnValue(false);

            await generarPDFReporte(
                mockReporte,
                mockClienteInfo,
                mockTecnicoInfo,
                mockParametros,
                mockVerificaciones
            );

            expect(fs.mkdirSync).toHaveBeenCalledWith(
                expect.stringContaining('uploads/reportes'),
                { recursive: true }
            );
        });

        it('debería incluir información del cliente en el PDF', async () => {
            const mockDoc = new PDFDocument();

            await generarPDFReporte(
                mockReporte,
                mockClienteInfo,
                mockTecnicoInfo,
                mockParametros,
                mockVerificaciones
            );

            // Verificar que se llamó text con información del cliente
            const textCalls = mockDoc.text.mock.calls.map(call => call[0]);
            expect(textCalls.some(call => call?.includes('Empresa Test'))).toBe(true);
            expect(textCalls.some(call => call?.includes('Calle 123 #45-67'))).toBe(true);
            expect(textCalls.some(call => call?.includes('Bogotá'))).toBe(true);
        });

        it('debería incluir información del generador en el PDF', async () => {
            const mockDoc = new PDFDocument();

            await generarPDFReporte(
                mockReporte,
                mockClienteInfo,
                mockTecnicoInfo,
                mockParametros,
                mockVerificaciones
            );

            const textCalls = mockDoc.text.mock.calls.map(call => call[0]);
            expect(textCalls.some(call => call?.includes('Caterpillar'))).toBe(true);
            expect(textCalls.some(call => call?.includes('C15'))).toBe(true);
            expect(textCalls.some(call => call?.includes('500'))).toBe(true);
        });

        it('debería incluir parámetros de operación en el PDF', async () => {
            const mockDoc = new PDFDocument();

            await generarPDFReporte(
                mockReporte,
                mockClienteInfo,
                mockTecnicoInfo,
                mockParametros,
                mockVerificaciones
            );

            const textCalls = mockDoc.text.mock.calls.map(call => call[0]);
            expect(textCalls.some(call => call?.includes('50 PSI'))).toBe(true);
            expect(textCalls.some(call => call?.includes('80°C'))).toBe(true);
            expect(textCalls.some(call => call?.includes('1800 RPM'))).toBe(true);
        });

        it('debería incluir verificaciones en el PDF', async () => {
            const mockDoc = new PDFDocument();

            await generarPDFReporte(
                mockReporte,
                mockClienteInfo,
                mockTecnicoInfo,
                mockParametros,
                mockVerificaciones
            );

            const textCalls = mockDoc.text.mock.calls.map(call => call[0]);
            expect(textCalls.some(call => call?.includes('Nivel de aceite'))).toBe(true);
            expect(textCalls.some(call => call?.includes('Filtros'))).toBe(true);
            expect(textCalls.some(call => call?.includes('Baterías'))).toBe(true);
        });

        it('debería manejar parámetros vacíos sin errores', async () => {
            await expect(
                generarPDFReporte(
                    mockReporte,
                    mockClienteInfo,
                    mockTecnicoInfo,
                    [],
                    mockVerificaciones
                )
            ).resolves.toBeDefined();
        });

        it('debería manejar verificaciones vacías sin errores', async () => {
            await expect(
                generarPDFReporte(
                    mockReporte,
                    mockClienteInfo,
                    mockTecnicoInfo,
                    mockParametros,
                    []
                )
            ).resolves.toBeDefined();
        });

        it('debería incluir observaciones finales si existen', async () => {
            const mockDoc = new PDFDocument();

            await generarPDFReporte(
                mockReporte,
                mockClienteInfo,
                mockTecnicoInfo,
                mockParametros,
                mockVerificaciones
            );

            const textCalls = mockDoc.text.mock.calls.map(call => call[0]);
            expect(textCalls.some(call => 
                call?.includes('Mantenimiento preventivo completado')
            )).toBe(true);
        });

        it('debería llamar doc.end() para finalizar el PDF', async () => {
            const mockDoc = new PDFDocument();

            await generarPDFReporte(
                mockReporte,
                mockClienteInfo,
                mockTecnicoInfo,
                mockParametros,
                mockVerificaciones
            );

            expect(mockDoc.end).toHaveBeenCalled();
        });

        it('debería manejar valores N/A para campos opcionales', async () => {
            const reporteSinOpcionales = {
                ...mockReporte,
                kva: null,
                serie_generador: null,
                telefono: null
            };

            await expect(
                generarPDFReporte(
                    reporteSinOpcionales,
                    mockClienteInfo,
                    mockTecnicoInfo,
                    mockParametros,
                    mockVerificaciones
                )
            ).resolves.toBeDefined();
        });

        it('debería generar nombre de archivo único usando crypto', async () => {
            const pdfPath1 = await generarPDFReporte(
                mockReporte,
                mockClienteInfo,
                mockTecnicoInfo,
                mockParametros,
                mockVerificaciones
            );

            expect(crypto.randomBytes).toHaveBeenCalledWith(8);
            expect(pdfPath1).toContain('reporte_mantenimiento_abc123def456.pdf');
        });

        it('debería incluir información del técnico en el PDF', async () => {
            const mockDoc = new PDFDocument();

            await generarPDFReporte(
                mockReporte,
                mockClienteInfo,
                mockTecnicoInfo,
                mockParametros,
                mockVerificaciones
            );

            const textCalls = mockDoc.text.mock.calls.map(call => call[0]);
            expect(textCalls.some(call => call?.includes('Carlos'))).toBe(true);
            expect(textCalls.some(call => call?.includes('Técnico'))).toBe(true);
        });
    });
});
