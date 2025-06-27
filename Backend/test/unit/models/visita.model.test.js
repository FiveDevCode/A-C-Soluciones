import { VisitaModel } from '../../../src/models/visita.model.js';
import { DataTypes } from 'sequelize';
import { sequelize } from '../../../src/database/conexion.js';

const { Visita } = VisitaModel;

// Configuración de timeouts más largos
jest.setTimeout(30000); // 30 segundos para todos los tests

describe('Visita Model Tests', () => {
  beforeAll(async () => {
    // Configurar una conexión especial para tests
    if (!sequelize.options.dialect === 'sqlite') {
      // Usar SQLite en memoria para tests más rápidos
      const testSequelize = new Sequelize('sqlite::memory:');
      Visita.init(VisitaModel.Visita.attributes, {
        sequelize: testSequelize,
        modelName: 'Visita',
        tableName: 'visitas'
      });
    }
    
    // Sincronizar con timeout extendido
    await Visita.sync({ force: true, logging: false });
  });

  afterAll(async () => {
    // Cerrar la conexión después de los tests
    await sequelize.close();
  });

  test('Debe crear una visita válida', async () => {
    const visita = await Visita.create({
      fecha_programada: new Date(Date.now() + 86400000), // Mañana
      duracion_estimada: 60,
      estado: 'programada',
      solicitud_id_fk: 1,
      tecnico_id_fk: 1,
      servicio_id_fk: 1
    });

    expect(visita.id).toBeDefined();
    expect(visita.fecha_programada).toBeInstanceOf(Date);
    expect(visita.duracion_estimada).toBe(60);
    expect(visita.estado).toBe('programada');
    expect(visita.solicitud_id_fk).toBe(1);
    expect(visita.tecnico_id_fk).toBe(1);
    expect(visita.servicio_id_fk).toBe(1);
  });

  test('No debe permitir fechas en el pasado', async () => {
    expect.assertions(1);
    try {
      await Visita.build({
        fecha_programada: new Date(Date.now() - 86400000), // Ayer
        duracion_estimada: 60,
        estado: 'programada',
        solicitud_id_fk: 1,
        tecnico_id_fk: 1,
        servicio_id_fk: 1
      }).validate();
    } catch (error) {
      expect(error.message).toMatch('La fecha no puede ser anterior a la fecha actual');
    }
  });

  test('Debe validar la duración mínima de 15 minutos', async () => {
    expect.assertions(1);
    try {
      await Visita.build({
        fecha_programada: new Date(Date.now() + 86400000),
        duracion_estimada: 10,
        estado: 'programada',
        solicitud_id_fk: 1,
        tecnico_id_fk: 1,
        servicio_id_fk: 1
      }).validate();
    } catch (error) {
      expect(error.message).toMatch('La duración mínima es de 15 minutos');
    }
  });

  test('Debe validar la duración máxima de 480 minutos (8 horas)', async () => {
    expect.assertions(1);
    try {
      await Visita.build({
        fecha_programada: new Date(Date.now() + 86400000),
        duracion_estimada: 500,
        estado: 'programada',
        solicitud_id_fk: 1,
        tecnico_id_fk: 1,
        servicio_id_fk: 1
      }).validate();
    } catch (error) {
      expect(error.message).toMatch('La duración máxima es de 8 horas (480 minutos)');
    }
  });

  test('Debe establecer el estado por defecto como "programada"', async () => {
    const visita = await Visita.build({
      fecha_programada: new Date(Date.now() + 86400000),
      duracion_estimada: 60,
      solicitud_id_fk: 1,
      tecnico_id_fk: 1,
      servicio_id_fk: 1
    });

    expect(visita.estado).toBe('programada');
  });

//   test('Debe validar el enum de estados', async () => {
//     expect.assertions(1);
//     try {
//       await Visita.build({
//         fecha_programada: new Date(Date.now() + 86400000),
//         duracion_estimada: 60,
//         estado: 'estado_invalido',
//         solicitud_id_fk: 1,
//         tecnico_id_fk: 1,
//         servicio_id_fk: 1
//       }).validate();
//     } catch (error) {
//       expect(error.message).toMatch(/Validation/);
//     }
//   });

  test('Debe validar la longitud máxima de notas_previas (250 caracteres)', async () => {
    expect.assertions(1);
    try {
      const notaLarga = 'a'.repeat(251);
      await Visita.build({
        fecha_programada: new Date(Date.now() + 86400000),
        duracion_estimada: 60,
        estado: 'programada',
        notas_previas: notaLarga,
        solicitud_id_fk: 1,
        tecnico_id_fk: 1,
        servicio_id_fk: 1
      }).validate();
    } catch (error) {
      expect(error.message).toMatch('Las notas no pueden exceder los 250 caracteres');
    }
  });

  test('Debe permitir notas_previas y notas_posteriores como nulas', async () => {
    const visita = await Visita.create({
      fecha_programada: new Date(Date.now() + 86400000),
      duracion_estimada: 60,
      estado: 'programada',
      solicitud_id_fk: 1,
      tecnico_id_fk: 1,
      servicio_id_fk: 1
    });

    expect(visita.notas_previas).toBeNull();
    expect(visita.notas_posteriores).toBeNull();
  });

  test('Debe establecer fecha_creacion automáticamente', async () => {
    const visita = await Visita.create({
      fecha_programada: new Date(Date.now() + 86400000),
      duracion_estimada: 60,
      estado: 'programada',
      solicitud_id_fk: 1,
      tecnico_id_fk: 1,
      servicio_id_fk: 1
    });

    expect(visita.fecha_creacion).toBeInstanceOf(Date);
    expect(visita.fecha_creacion.getTime()).toBeLessThanOrEqual(Date.now());
  });

  test('Debe requerir todos los campos obligatorios', async () => {
    expect.assertions(1);
    try {
      await Visita.build({}).validate();
    } catch (error) {
      expect(error.message).toMatch(/notNull Violation/);
    }
  });
});