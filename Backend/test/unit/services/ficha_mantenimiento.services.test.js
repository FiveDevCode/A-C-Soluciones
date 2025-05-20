import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { generarPDF } from '../../../src/services/ficha_mantenimiento.services.js';

jest.mock('fs');
jest.mock('pdfkit');

describe('generarPDF', () => {
  let mockDoc, mockWriteStream;

  beforeEach(() => {
    mockWriteStream = {
      on: jest.fn((event, cb) => {
        if (event === 'finish') setTimeout(cb, 0);
      }),
      once: jest.fn(),
      emit: jest.fn(),
    };

    mockDoc = {
      pipe: jest.fn(),
      fontSize: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis(),
      moveDown: jest.fn().mockReturnThis(),
      image: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };

    PDFDocument.mockImplementation(() => mockDoc);
    fs.createWriteStream.mockReturnValue(mockWriteStream);
    fs.existsSync.mockImplementation((p) => true);
    fs.mkdirSync.mockImplementation(() => {});
  });

  const ficha = {
    id: 1,
    fecha_de_mantenimiento: '2024-05-01T00:00:00Z',
    introduccion: 'Intro',
    detalles_servicio: 'Detalles',
    observaciones: 'Obs',
    estado_antes: 'Antes',
    descripcion_trabajo: 'Trabajo',
    materiales_utilizados: 'Materiales',
    estado_final: 'Final',
    tiempo_de_trabajo: '5h',
    recomendaciones: 'Recomendaciones'
  };

  const clienteInfo = {
    nombre: 'Juan',
    telefono: '123',
    correo: 'juan@test.com'
  };

  const tecnicoInfo = {
    nombre: 'Carlos',
    apellido: 'Pérez',
    telefono: '456',
    correo: 'carlos@test.com'
  };

  const imagenes = {
    estadoAntes: 'ruta/antes.jpg',
    descripcion: 'ruta/desc.jpg',
    estadoFinal: 'ruta/final.jpg'
  };
  it('debería generar un PDF con imágenes si existen', async () => {
    fs.existsSync.mockImplementation((p) => true); // todas las imágenes existen

    const result = await generarPDF(ficha, clienteInfo, tecnicoInfo, imagenes);

    expect(fs.mkdirSync).not.toHaveBeenCalled(); // carpeta ya existe
    expect(mockDoc.image).toHaveBeenCalledTimes(3); // las 3 imágenes
    expect(result).toContain('ficha_1.pdf');
  });


it('debería crear el folder si no existe', async () => {
  fs.existsSync.mockImplementation((p) => false); 

  const result = await generarPDF(ficha, clienteInfo, tecnicoInfo, {});

  expect(fs.mkdirSync).toHaveBeenCalledWith(
    path.join('uploads', 'fichas'),
    { recursive: true }
  );
  expect(mockDoc.image).not.toHaveBeenCalled();
  expect(result).toContain('ficha_1.pdf');
});
  it('no debería agregar imágenes si fs.existsSync devuelve false', async () => {
    fs.existsSync.mockImplementation((p) => p.includes('uploads/fichas')); 

    const result = await generarPDF(ficha, clienteInfo, tecnicoInfo, imagenes);

    expect(mockDoc.image).not.toHaveBeenCalled();
    expect(result).toContain('ficha_1.pdf');
  });
  it('debería rechazar la promesa si el stream da error', async () => {
    fs.existsSync.mockReturnValue(true);

    mockWriteStream.on = jest.fn((event, cb) => {
      if (event === 'error') setTimeout(() => cb(new Error('Stream error')), 0);
    });

    await expect(generarPDF(ficha, clienteInfo, tecnicoInfo, {})).rejects.toThrow('Stream error');
  });
  it('no debería incluir recomendaciones si no existen', async () => {
    const fichaSinRecom = { ...ficha, recomendaciones: '' };

    await generarPDF(fichaSinRecom, clienteInfo, tecnicoInfo, {});

    expect(mockDoc.text).not.toHaveBeenCalledWith(expect.stringContaining('Recomendaciones:'));
  });
});
