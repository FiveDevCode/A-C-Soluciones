import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { generarPDF } from '../../../src/services/ficha_mantenimiento.services.js';

jest.mock('fs');
jest.mock('pdfkit');

describe('generarPDF', () => {
  let mockDoc;
  let mockStream;

  beforeEach(() => {
    // Mock fs methods
    fs.existsSync.mockReset();
    fs.mkdirSync.mockReset();
    fs.createWriteStream.mockReset();

    // Mock stream as event emitter
    mockStream = {
      on: jest.fn((event, cb) => {
        // Store callback for later triggering in tests
        if (event === 'finish') mockStream._finishCallback = cb;
        if (event === 'error') mockStream._errorCallback = cb;
        return mockStream;
      }),
    };

    fs.createWriteStream.mockReturnValue(mockStream);

    // Mock PDFDocument instance and methods
    mockDoc = {
      pipe: jest.fn(() => mockDoc),
      fontSize: jest.fn(() => mockDoc),
      text: jest.fn(() => mockDoc),
      moveDown: jest.fn(() => mockDoc),
      end: jest.fn(),
    };
    PDFDocument.mockImplementation(() => mockDoc);

    // Mock existsSync to false by default (folder does not exist)
    fs.existsSync.mockReturnValue(false);
  });

  test('crea la carpeta si no existe', async () => {
    const ficha = { id: 1, fecha_de_mantenimiento: new Date() };
    const clienteInfo = { nombre: 'Cliente', telefono: '123' };
    const tecnicoInfo = { nombre: 'Tecnico', apellido: 'Uno', telefono: '456', correo: 'tech@mail.com' };

    const promise = generarPDF(ficha, clienteInfo, tecnicoInfo);

    // Simula el finish
    mockStream._finishCallback();

    await expect(promise).resolves.toBe(path.join('uploads', 'fichas', `ficha_${ficha.id}.pdf`));

    expect(fs.existsSync).toHaveBeenCalledWith(path.join('uploads', 'fichas'));
    expect(fs.mkdirSync).toHaveBeenCalledWith(path.join('uploads', 'fichas'), { recursive: true });
  });

  test('no crea carpeta si ya existe', async () => {
    fs.existsSync.mockReturnValue(true);

    const ficha = { id: 2, fecha_de_mantenimiento: new Date() };
    const clienteInfo = { nombre: 'Cliente', telefono: '123' };
    const tecnicoInfo = { nombre: 'Tecnico', apellido: 'Uno', telefono: '456', correo: 'tech@mail.com' };

    const promise = generarPDF(ficha, clienteInfo, tecnicoInfo);
    mockStream._finishCallback();

    await expect(promise).resolves.toBe(path.join('uploads', 'fichas', `ficha_${ficha.id}.pdf`));

    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

  test('invoca los métodos PDFDocument correctos', async () => {
    const ficha = {
      id: 3,
      fecha_de_mantenimiento: new Date(),
      introduccion: 'Intro',
      detalles_servicio: 'Detalles',
      observaciones: 'Obs',
      estado_antes: 'Antes',
      descripcion_trabajo: 'Trabajo',
      materiales_utilizados: 'Materiales',
      estado_final: 'Final',
      tiempo_de_trabajo: '2 horas',
      recomendaciones: 'Recomendaciones',
    };
    const clienteInfo = { nombre: 'Cliente', telefono: '123' };
    const tecnicoInfo = { nombre: 'Tecnico', apellido: 'Uno', telefono: '456', correo: 'tech@mail.com' };

    const promise = generarPDF(ficha, clienteInfo, tecnicoInfo);
    mockStream._finishCallback();

    await promise;

    expect(mockDoc.fontSize).toHaveBeenCalled();
    expect(mockDoc.text).toHaveBeenCalledWith('Ficha de Mantenimiento', { align: 'center' });
    expect(mockDoc.end).toHaveBeenCalled();
  });

  test('rechaza la promesa si hay error en el stream', async () => {
    const ficha = { id: 4, fecha_de_mantenimiento: new Date() };
    const clienteInfo = { nombre: 'Cliente', telefono: '123' };
    const tecnicoInfo = { nombre: 'Tecnico', apellido: 'Uno', telefono: '456', correo: 'tech@mail.com' };

    const promise = generarPDF(ficha, clienteInfo, tecnicoInfo);

    const error = new Error('Stream error');
    mockStream._errorCallback(error);

    await expect(promise).rejects.toThrow(error);
  });
});
