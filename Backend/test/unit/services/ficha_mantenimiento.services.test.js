import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import crypto from 'crypto';
import { generarPDF } from '../../../src/services/ficha_mantenimiento.services.js';

// Mocks
jest.mock('fs');
jest.mock('path');
jest.mock('pdfkit');
jest.mock('crypto');

describe('📄 Servicio generarPDF', () => {
  let docMock;
  let streamMock;

  const fichaMock = {
    fecha_de_mantenimiento: '2025-10-22T00:00:00Z',
    introduccion: 'Mantenimiento preventivo de sistema eléctrico.',
    detalles_servicio: 'Revisión y limpieza de componentes.',
    estado_antes: 'Equipo con fallas menores.',
    descripcion_trabajo: 'Se realizaron ajustes y calibraciones.',
    materiales_utilizados: 'Aceite dieléctrico, limpiador de contactos.',
    estado_final: 'Equipo funcionando correctamente.',
    recomendaciones: 'Revisión mensual sugerida.',
    observaciones: 'Cliente satisfecho con el servicio.',
  };

  const clienteInfoMock = {
    nombre: 'Carlos Pérez',
    telefono: '3001234567',
    correo: 'carlos@example.com',
  };

  const tecnicoInfoMock = {
    nombre: 'Luis',
    apellido: 'Gómez',
    telefono: '3119876543',
    correo: 'luis@example.com',
  };

  const imagenesMock = {
    estadoAntes: 'ruta/antes.jpg',
    descripcion: 'ruta/trabajo.jpg',
    estadoFinal: 'ruta/final.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock de path
    path.join.mockImplementation((...args) => args.join('/'));

    // Mock de crypto con buffer HEX válido
    crypto.randomBytes.mockReturnValue(Buffer.from('abcd1234efab5678', 'hex'));

    // Mock de PDFDocument y sus métodos
    docMock = {
      pipe: jest.fn(),
      end: jest.fn(),
      fontSize: jest.fn().mockReturnThis(),
      font: jest.fn().mockReturnThis(),
      fillColor: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis(),
      moveDown: jest.fn().mockReturnThis(),
      strokeColor: jest.fn().mockReturnThis(),
      lineWidth: jest.fn().mockReturnThis(),
      moveTo: jest.fn().mockReturnThis(),
      lineTo: jest.fn().mockReturnThis(),
      stroke: jest.fn().mockReturnThis(),
      rect: jest.fn().mockReturnThis(),
      image: jest.fn().mockReturnThis(),
      getImageWidth: jest.fn().mockReturnValue(150),
      getImageHeight: jest.fn().mockReturnValue(100),
      page: { width: 600, height: 800 },
      y: 100,
      x: 50,
    };
    PDFDocument.mockImplementation(() => docMock);

    // Mock del stream
    streamMock = {
      on: jest.fn((event, cb) => {
        if (event === 'finish') setImmediate(cb);
      }),
    };

    fs.createWriteStream.mockReturnValue(streamMock);
    fs.existsSync.mockReturnValue(true);
    fs.mkdirSync.mockReturnValue(undefined);
  });

  test('✅ Genera un PDF correctamente y devuelve la ruta del archivo', async () => {
    const result = await generarPDF(fichaMock, clienteInfoMock, tecnicoInfoMock, imagenesMock);

    expect(fs.existsSync).toHaveBeenCalledWith('uploads/fichas');
    expect(fs.createWriteStream).toHaveBeenCalledWith('uploads/fichas/ficha_abcd1234efab5678.pdf');
    expect(PDFDocument).toHaveBeenCalledTimes(1);
    expect(docMock.pipe).toHaveBeenCalledWith(streamMock);
    expect(docMock.end).toHaveBeenCalled();
    expect(result).toBe('uploads/fichas/ficha_abcd1234efab5678.pdf');
  });

  test('📁 Crea la carpeta si no existe', async () => {
    fs.existsSync.mockReturnValue(false);
    await generarPDF(fichaMock, clienteInfoMock, tecnicoInfoMock);
    expect(fs.mkdirSync).toHaveBeenCalledWith('uploads/fichas', { recursive: true });
  });

  test('⚙️ Maneja correctamente cuando no hay imágenes', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await generarPDF(fichaMock, clienteInfoMock, tecnicoInfoMock, {});
    expect(result).toContain('uploads/fichas/ficha_');
  });

  test('🧨 Lanza error si el stream falla', async () => {
    streamMock.on.mockImplementation((event, cb) => {
      if (event === 'error') setImmediate(() => cb(new Error('Error de escritura')));
    });

    await expect(
      generarPDF(fichaMock, clienteInfoMock, tecnicoInfoMock)
    ).rejects.toThrow('Error de escritura');
  });

  test('🖋️ Dibuja correctamente las secciones principales', async () => {
    await generarPDF(fichaMock, clienteInfoMock, tecnicoInfoMock, imagenesMock);

    expect(docMock.text).toHaveBeenCalled();
    expect(docMock.stroke).toHaveBeenCalled();
    expect(docMock.font).toHaveBeenCalledWith('Helvetica-Bold');
    expect(docMock.fontSize).toHaveBeenCalledWith(20);
  });
});
