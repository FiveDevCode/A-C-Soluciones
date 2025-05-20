import multer from 'multer';
import path from 'path';
import fs from 'fs';
import upload from '../../../src/middlewares/uploadImages.js';

jest.mock('fs');

describe('uploadImages middleware', () => {
  const storage = upload.storage;

  describe('storage.destination', () => {
    it('debería crear la carpeta si no existe', () => {
      const cb = jest.fn();
      fs.mkdirSync.mockImplementation(() => {}); // simulamos creación

      storage.getDestination({}, {}, cb);

      expect(fs.mkdirSync).toHaveBeenCalledWith('uploads/fotos_fichas', { recursive: true });
      expect(cb).toHaveBeenCalledWith(null, 'uploads/fotos_fichas');
    });
  });

  describe('storage.filename', () => {
    it('debería generar un nombre único', () => {
      const cb = jest.fn();
      const fakeFile = { originalname: 'foto.png' };

      jest.useFakeTimers().setSystemTime(new Date('2025-01-01'));

      storage.getFilename({}, fakeFile, cb);

      expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(/^.*_foto\.png$/));

      jest.useRealTimers();
    });
  });

  describe('fileFilter', () => {
    const validFiles = ['foto.jpg', 'imagen.jpeg', 'pic.PNG'];
    const invalidFiles = ['doc.pdf', 'script.js'];

    validFiles.forEach((filename) => {
      it(`debería aceptar archivo válido: ${filename}`, () => {
        const cb = jest.fn();
        const file = { originalname: filename };

        upload.fileFilter({}, file, cb);
        expect(cb).toHaveBeenCalledWith(null, true);
      });
    });

    invalidFiles.forEach((filename) => {
      it(`debería rechazar archivo inválido: ${filename}`, () => {
        const cb = jest.fn();
        const file = { originalname: filename };

        upload.fileFilter({}, file, cb);
        expect(cb).toHaveBeenCalledWith(expect.any(Error));
        expect(cb.mock.calls[0][0].message).toMatch(/Solo se permiten imágenes/i);
      });
    });
  });
});
