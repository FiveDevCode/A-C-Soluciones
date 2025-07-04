import { DataTypes, ValidationError } from 'sequelize';
import { sequelize } from '../../../src/database/conexion.js';
import { FaqModel } from '../../../src/models/preguntas_frecuentes.model.js';

const { Faq } = FaqModel;

describe('Modelo Faq', () => {

  it('debería tener el nombre correcto de tabla', () => {
    expect(Faq.getTableName()).toBe('preguntas_frecuentes');
  });

  it('debería tener todos los campos definidos', () => {
    const attributes = Faq.rawAttributes;

    expect(attributes).toHaveProperty('id');
    expect(attributes).toHaveProperty('pregunta');
    expect(attributes).toHaveProperty('respuesta');
    expect(attributes).toHaveProperty('categoria');
    expect(attributes).toHaveProperty('id_administrador');
  });

  describe('validaciones de campo "pregunta"', () => {
    it('debería lanzar error si está vacía', async () => {
      try {
        await Faq.build({ pregunta: '', respuesta: 'valida', categoria: 'servicios', id_administrador: 1 }).validate();
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.errors[0].message).toBe('La pregunta no puede estar vacía.');
      }
    });

    it('debería lanzar error si tiene menos de 5 caracteres', async () => {
      try {
        await Faq.build({ pregunta: '1234', respuesta: 'valida', categoria: 'servicios', id_administrador: 1 }).validate();
      } catch (error) {
        expect(error.errors[0].message).toBe('La pregunta debe tener entre 5 y 350 caracteres.');
      }
    });

    it('debería lanzar error si empieza o termina con espacios', async () => {
      try {
        await Faq.build({ pregunta: ' espacio ', respuesta: 'valida', categoria: 'servicios', id_administrador: 1 }).validate();
      } catch (error) {
        expect(error.errors[0].message).toBe('La pregunta no debe comenzar ni terminar con espacios.');
      }
    });
  });

  describe('validaciones de campo "respuesta"', () => {
    it('debería lanzar error si está vacía', async () => {
      try {
        await Faq.build({ pregunta: 'Pregunta válida', respuesta: '', categoria: 'servicios', id_administrador: 1 }).validate();
      } catch (error) {
        expect(error.errors[0].message).toBe('La respuesta no puede estar vacía.');
      }
    });

    it('debería lanzar error si tiene menos de 5 caracteres', async () => {
      try {
        await Faq.build({ pregunta: 'Pregunta válida', respuesta: '1234', categoria: 'servicios', id_administrador: 1 }).validate();
      } catch (error) {
        expect(error.errors[0].message).toBe('La respuesta debe tener entre 5 y 500 caracteres.');
      }
    });

    it('debería lanzar error si empieza o termina con espacios', async () => {
      try {
        await Faq.build({ pregunta: 'Pregunta válida', respuesta: ' respuesta ', categoria: 'servicios', id_administrador: 1 }).validate();
      } catch (error) {
        expect(error.errors[0].message).toBe('La respuesta no debe comenzar ni terminar con espacios.');
      }
    });
  });

  describe('validaciones de campo "categoria"', () => {
    it('debería lanzar error si está vacía', async () => {
      try {
        await Faq.build({ pregunta: 'Pregunta válida', respuesta: 'Respuesta válida', categoria: '', id_administrador: 1 }).validate();
      } catch (error) {
        expect(error.errors[0].message).toBe('La categoría no puede estar vacía.');
      }
    });

    it('debería lanzar error si tiene menos de 3 caracteres', async () => {
      try {
        await Faq.build({ pregunta: 'Pregunta válida', respuesta: 'Respuesta válida', categoria: 'ab', id_administrador: 1 }).validate();
      } catch (error) {
        expect(error.errors[0].message).toBe('La categoría debe tener entre 3 y 50 caracteres.');
      }
    });
  });

  it('debería validar correctamente con datos válidos', async () => {
  const validData = {
    pregunta: '¿Cómo puedo solicitar un servicio?',
    respuesta: 'Puede solicitarlo desde su panel de cliente.',
    categoria: 'solicitud de un servicio',
    id_administrador: 1
  };

  const faq = Faq.build(validData);
  await expect(faq.validate.bind(faq)).not.toThrow();
});

});
