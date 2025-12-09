// Mocks PRIMERO
jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

jest.mock('../../../src/hooks/encryptPassword.js', () => ({
    encryptPasswordHook: jest.fn()
}));

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

jest.mock('../../../src/models/administrador.model.js', () => ({
    AdminModel: { Admin: {} }
}));

jest.mock('../../../src/models/visita.model.js', () => ({
    VisitaModel: { Visita: {} }
}));

jest.mock('../../../src/repository/reporte_bombeo.repository.js');
jest.mock('fs');
jest.mock('path');
jest.mock('pdfkit');
jest.mock('crypto');

// Ahora los imports
import * as reporteServices from '../../../src/services/reporte_bombeo.services.js';
import * as reporteRepo from '../../../src/repository/reporte_bombeo.repository.js';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import crypto from 'crypto';

describe('Reporte Bombeo Services', () => {
    let mockDoc;
    let mockStream;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock del stream
        mockStream = {
            on: jest.fn((event, callback) => {
                if (event === 'finish') {
                    // Llamar al callback inmediatamente para simular que el stream terminó
                    setTimeout(() => callback(), 0);
                }
                return mockStream;
            })
        };

        // Mock del documento PDF
        mockDoc = {
            pipe: jest.fn().mockReturnValue(mockStream),
            fillColor: jest.fn().mockReturnThis(),
            fontSize: jest.fn().mockReturnThis(),
            font: jest.fn().mockReturnThis(),
            text: jest.fn().mockReturnThis(),
            rect: jest.fn().mockReturnThis(),
            fillAndStroke: jest.fn().mockReturnThis(),
            fill: jest.fn().mockReturnThis(),
            strokeColor: jest.fn().mockReturnThis(),
            lineWidth: jest.fn().mockReturnThis(),
            stroke: jest.fn().mockReturnThis(),
            moveTo: jest.fn().mockReturnThis(),
            lineTo: jest.fn().mockReturnThis(),
            addPage: jest.fn().mockReturnThis(),
            end: jest.fn(),
            y: 100
        };

        PDFDocument.mockImplementation(() => mockDoc);

        // Mock de fs
        fs.existsSync = jest.fn().mockReturnValue(true);
        fs.mkdirSync = jest.fn();
        fs.createWriteStream = jest.fn().mockReturnValue(mockStream);

        // Mock de path
        path.join = jest.fn((...args) => args.join('/'));

        // Mock de crypto
        crypto.randomBytes = jest.fn().mockReturnValue({
            toString: jest.fn().mockReturnValue('abcd1234')
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('generarPDFReporteBombeo', () => {
        const mockReporte = {
            id: 1,
            fecha: '2024-12-06',
            direccion: 'Calle 123',
            ciudad: 'Bogotá',
            telefono: '3001234567',
            encargado: 'Juan Pérez',
            observaciones_finales: 'Todo en orden'
        };

        const mockEquipos = [
            {
                equipo: 'Bomba 1',
                marca: 'Marca A',
                amperaje: '10A',
                presion: '50PSI',
                temperatura: '25°C',
                estado: 'Bueno',
                observacion: 'OK'
            },
            {
                equipo: 'Bomba 2',
                marca: 'Marca B',
                amperaje: '12A',
                presion: '60PSI',
                temperatura: '30°C',
                estado: 'Regular',
                observacion: 'Revisar'
            }
        ];

        const mockParametrosLinea = {
            voltaje_linea: '220V',
            corriente_linea: '15A',
            presion_succion: '30PSI',
            presion_descarga: '70PSI',
            observaciones: 'Valores normales'
        };

        const mockClienteInfo = {
            nombre: 'Empresa ABC',
            correo: 'cliente@example.com'
        };

        const mockTecnicoInfo = {
            nombre: 'Carlos',
            apellido: 'García',
            identificacion: '1234567890'
        };

        it('debería generar un PDF y retornar la ruta del archivo', async () => {
            const result = await reporteServices.generarPDFReporteBombeo(
                mockReporte,
                mockEquipos,
                mockParametrosLinea,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(crypto.randomBytes).toHaveBeenCalledWith(8);
            expect(path.join).toHaveBeenCalledWith('uploads', 'reportes_bombeo');
            expect(path.join).toHaveBeenCalledWith('uploads/reportes_bombeo', 'reporte_bombeo_abcd1234.pdf');
            expect(fs.createWriteStream).toHaveBeenCalledWith('uploads/reportes_bombeo/reporte_bombeo_abcd1234.pdf');
            expect(PDFDocument).toHaveBeenCalledWith({ margin: 40, size: 'LETTER' });
            expect(mockDoc.pipe).toHaveBeenCalledWith(mockStream);
            expect(mockDoc.end).toHaveBeenCalled();
            expect(result).toBe('uploads/reportes_bombeo/reporte_bombeo_abcd1234.pdf');
        });

        it('debería crear el directorio si no existe', async () => {
            fs.existsSync = jest.fn().mockReturnValue(false);

            await reporteServices.generarPDFReporteBombeo(
                mockReporte,
                mockEquipos,
                mockParametrosLinea,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(fs.existsSync).toHaveBeenCalledWith('uploads/reportes_bombeo');
            expect(fs.mkdirSync).toHaveBeenCalledWith('uploads/reportes_bombeo', { recursive: true });
        });

        it('debería incluir información del header de la empresa', async () => {
            await reporteServices.generarPDFReporteBombeo(
                mockReporte,
                mockEquipos,
                mockParametrosLinea,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(mockDoc.text).toHaveBeenCalledWith(
                'A&C SOLUCIONES HIDROELÉCTRICAS SAS',
                expect.any(Number),
                expect.any(Number),
                expect.any(Object)
            );
            expect(mockDoc.text).toHaveBeenCalledWith('NIT: 901269341-0', expect.any(Number), expect.any(Number));
        });

        it('debería incluir información del cliente y fecha en el título del reporte', async () => {
            await reporteServices.generarPDFReporteBombeo(
                mockReporte,
                mockEquipos,
                mockParametrosLinea,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(mockDoc.text).toHaveBeenCalledWith(
                'REPORTE MANTENIMIENTO DE EQUIPOS DE BOMBEO',
                expect.any(Number),
                expect.any(Number),
                expect.any(Object)
            );
            expect(mockDoc.text).toHaveBeenCalledWith(
                expect.stringContaining('CLIENTE: Empresa ABC'),
                expect.any(Number),
                expect.any(Number),
                expect.any(Object)
            );
        });

        it('debería incluir la tabla de equipos con todos los datos', async () => {
            await reporteServices.generarPDFReporteBombeo(
                mockReporte,
                mockEquipos,
                mockParametrosLinea,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(mockDoc.text).toHaveBeenCalledWith('EQUIPOS DE BOMBEO', expect.any(Number), expect.any(Number));
            expect(mockDoc.text).toHaveBeenCalledWith('EQUIPO', expect.any(Number), expect.any(Number), expect.any(Object));
            expect(mockDoc.text).toHaveBeenCalledWith('MARCA', expect.any(Number), expect.any(Number), expect.any(Object));
            expect(mockDoc.text).toHaveBeenCalledWith('ESTADO', expect.any(Number), expect.any(Number), expect.any(Object));
        });

        it('debería incluir los parámetros eléctricos y de presión', async () => {
            await reporteServices.generarPDFReporteBombeo(
                mockReporte,
                mockEquipos,
                mockParametrosLinea,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(mockDoc.text).toHaveBeenCalledWith(
                'PARÁMETROS ELÉCTRICOS Y DE PRESIÓN',
                expect.any(Number),
                expect.any(Number)
            );
            expect(mockDoc.text).toHaveBeenCalledWith(
                expect.stringContaining('220V'),
                expect.any(Object)
            );
        });

        it('debería incluir las observaciones finales', async () => {
            await reporteServices.generarPDFReporteBombeo(
                mockReporte,
                mockEquipos,
                mockParametrosLinea,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(mockDoc.text).toHaveBeenCalledWith(
                'OBSERVACIONES Y RECOMENDACIONES FINALES',
                expect.any(Number),
                expect.any(Number)
            );
            expect(mockDoc.text).toHaveBeenCalledWith(
                'Todo en orden',
                expect.any(Number),
                expect.any(Number),
                expect.any(Object)
            );
        });

        it('debería incluir las firmas del técnico y cliente', async () => {
            await reporteServices.generarPDFReporteBombeo(
                mockReporte,
                mockEquipos,
                mockParametrosLinea,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(mockDoc.text).toHaveBeenCalledWith(
                'TÉCNICO: Carlos García',
                expect.any(Number),
                expect.any(Number),
                expect.any(Object)
            );
            expect(mockDoc.text).toHaveBeenCalledWith(
                'C.C./ID: 1234567890',
                expect.any(Number),
                expect.any(Number),
                expect.any(Object)
            );
            expect(mockDoc.text).toHaveBeenCalledWith(
                'CLIENTE / ENCARGADO',
                expect.any(Number),
                expect.any(Number),
                expect.any(Object)
            );
            expect(mockDoc.text).toHaveBeenCalledWith(
                'NOMBRE: Juan Pérez',
                expect.any(Number),
                expect.any(Number),
                expect.any(Object)
            );
        });

        it('debería manejar valores N/A cuando faltan datos en equipos', async () => {
            const equiposIncompletos = [{
                equipo: 'Bomba 1'
                // Faltan otros campos
            }];

            await reporteServices.generarPDFReporteBombeo(
                mockReporte,
                equiposIncompletos,
                mockParametrosLinea,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(mockDoc.text).toHaveBeenCalledWith('N/A', expect.any(Number), expect.any(Number), expect.any(Object));
        });

        it('debería manejar valores N/A cuando faltan datos en parámetros', async () => {
            const parametrosIncompletos = {};

            await reporteServices.generarPDFReporteBombeo(
                mockReporte,
                mockEquipos,
                parametrosIncompletos,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(mockDoc.text).toHaveBeenCalledWith(
                expect.stringContaining('N/A'),
                expect.any(Object)
            );
        });

        it('debería manejar observaciones finales vacías', async () => {
            const reporteSinObservaciones = { ...mockReporte, observaciones_finales: null };

            await reporteServices.generarPDFReporteBombeo(
                reporteSinObservaciones,
                mockEquipos,
                mockParametrosLinea,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(mockDoc.text).toHaveBeenCalledWith(
                'Sin observaciones/recomendaciones finales.',
                expect.any(Number),
                expect.any(Number),
                expect.any(Object)
            );
        });

        it('debería manejar observaciones de parámetros vacías', async () => {
            const parametrosSinObservaciones = { ...mockParametrosLinea, observaciones: null };

            await reporteServices.generarPDFReporteBombeo(
                mockReporte,
                mockEquipos,
                parametrosSinObservaciones,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(mockDoc.text).toHaveBeenCalledWith(
                'Sin observaciones.',
                expect.any(Number),
                expect.any(Number),
                expect.any(Object)
            );
        });

        it('debería dibujar rectángulos y líneas para el diseño del PDF', async () => {
            await reporteServices.generarPDFReporteBombeo(
                mockReporte,
                mockEquipos,
                mockParametrosLinea,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(mockDoc.rect).toHaveBeenCalled();
            expect(mockDoc.moveTo).toHaveBeenCalled();
            expect(mockDoc.lineTo).toHaveBeenCalled();
            expect(mockDoc.stroke).toHaveBeenCalled();
        });

        it('debería rechazar la promesa si ocurre un error en el stream', async () => {
            mockStream.on = jest.fn((event, callback) => {
                if (event === 'error') {
                    setTimeout(() => callback(new Error('Stream error')), 0);
                }
                return mockStream;
            });

            await expect(
                reporteServices.generarPDFReporteBombeo(
                    mockReporte,
                    mockEquipos,
                    mockParametrosLinea,
                    mockClienteInfo,
                    mockTecnicoInfo
                )
            ).rejects.toThrow('Stream error');
        });

        it('debería procesar múltiples equipos correctamente', async () => {
            const muchosEquipos = Array(10).fill(null).map((_, i) => ({
                equipo: `Bomba ${i + 1}`,
                marca: `Marca ${i + 1}`,
                amperaje: `${10 + i}A`,
                presion: `${50 + i}PSI`,
                temperatura: `${25 + i}°C`,
                estado: 'Bueno',
                observacion: 'OK'
            }));

            await reporteServices.generarPDFReporteBombeo(
                mockReporte,
                muchosEquipos,
                mockParametrosLinea,
                mockClienteInfo,
                mockTecnicoInfo
            );

            expect(mockDoc.end).toHaveBeenCalled();
            expect(PDFDocument).toHaveBeenCalled();
        });
    });
});
