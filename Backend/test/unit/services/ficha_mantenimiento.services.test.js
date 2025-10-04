import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { generarPDF } from '../../../src/services/ficha_mantenimiento.services';

jest.mock('fs');
jest.mock('path');
jest.mock('pdfkit');

describe('generarPDF', () => {
  let pipeMock, endMock, textMock, writeStreamMock;

  beforeEach(() => {
    jest.resetAllMocks();

    writeStreamMock = {
      on: jest.fn(),
      once: jest.fn(),
    };

    pipeMock = jest.fn();
    endMock = jest.fn();
    textMock = jest.fn().mockReturnThis();

    PDFDocument.mockImplementation(() => ({
      pipe: pipeMock,
      end: endMock,
      text: textMock,
      rect: jest.fn().mockReturnThis(),
      fill: jest.fn().mockReturnThis(),
      fillColor: jest.fn().mockReturnThis(),
      font: jest.fn().mockReturnThis(),
      fontSize: jest.fn().mockReturnThis(),
      moveDown: jest.fn().mockReturnThis(),
      image: jest.fn().mockReturnThis(),
      stroke: jest.fn().mockReturnThis(),
      y: 100,
      page: { width: 595.28, height: 841.89 },
    }));

    fs.createWriteStream.mockReturnValue(writeStreamMock);
    fs.existsSync.mockReturnValue(true);
    fs.mkdirSync.mockImplementation(() => {});
    path.join.mockImplementation((...args) => args.join('/'));
  });

  const fichaMock = {
    id: 123,
    fecha_de_mantenimiento: new Date().toISOString(),
    introduccion: 'Introducción texto.',
    detalles_servicio: 'Detalles del servicio.',
    estado_antes: 'Estado antes del mantenimiento.',
    descripcion_trabajo: 'Descripción del trabajo.',
    materiales_utilizados: 'Materiales utilizados.',
    estado_final: 'Estado final.',
    tiempo_de_trabajo: '2 horas',
    recomendaciones: 'Recomendaciones de mantenimiento.',
    observaciones: 'Observaciones adicionales.'
  };

  const clienteMock = {
    nombre: 'Cliente Ejemplo',
    telefono: '3126753209'
  };

  const tecnicoMock = {
    nombre: 'Juan',
    apellido: 'Pérez',
    telefono: '6741890210',
    correo: 'juan@example.com'
  };

  const imagenesMock = {
    estadoAntes: 'ruta/imagen1.png',
    descripcion: 'ruta/imagen2.png',
    estadoFinal: 'ruta/imagen3.png'
  };

  it('genera PDF exitosamente con todas las secciones e imágenes existentes', async () => {
    fs.existsSync.mockImplementation((path) => {
      return path.includes('imagen') || path.includes('uploads/fichas');
    });

    const finishCallback = jest.fn();
    const errorCallback = jest.fn();
    writeStreamMock.on.mockImplementation((event, cb) => {
      if (event === 'finish') cb();
      if (event === 'error') errorCallback;
    });

    const result = await generarPDF(fichaMock, clienteMock, tecnicoMock, imagenesMock);

    expect(pipeMock).toHaveBeenCalled();
    expect(endMock).toHaveBeenCalled();
    expect(result).toContain('uploads/fichas/ficha_123.pdf');
  });

  it('crea la carpeta si no existe', async () => {
    fs.existsSync.mockReturnValue(false);
    const finishCallback = jest.fn();
    writeStreamMock.on.mockImplementation((event, cb) => {
      if (event === 'finish') cb();
    });

    await generarPDF(fichaMock, clienteMock, tecnicoMock, {});

    expect(fs.mkdirSync).toHaveBeenCalledWith('uploads/fichas', { recursive: true });
  });

  it('omite secciones si no existen en ficha', async () => {
    const fichaParcial = {
      id: 999,
      fecha_de_mantenimiento: new Date().toISOString(),
      tiempo_de_trabajo: '1h'
    };

    writeStreamMock.on.mockImplementation((event, cb) => {
      if (event === 'finish') cb();
    });

    const result = await generarPDF(fichaParcial, clienteMock, tecnicoMock);
    expect(result).toContain('ficha_999.pdf');
  });

  it('omite imágenes si no existen', async () => {
    fs.existsSync.mockReturnValue(false);

    writeStreamMock.on.mockImplementation((event, cb) => {
      if (event === 'finish') cb();
    });

    const result = await generarPDF(fichaMock, clienteMock, tecnicoMock, {
      estadoAntes: 'noexiste1.png',
      descripcion: 'noexiste2.png',
      estadoFinal: 'noexiste3.png'
    });

    expect(result).toContain('ficha_123.pdf');
  });

  it('rechaza si ocurre un error en el stream', async () => {
    writeStreamMock.on.mockImplementation((event, cb) => {
      if (event === 'error') cb(new Error('Stream error'));
    });

    await expect(generarPDF(fichaMock, clienteMock, tecnicoMock)).rejects.toThrow('Stream error');
  });
});
