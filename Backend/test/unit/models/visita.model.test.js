import { DataTypes } from 'sequelize';
import { VisitaModel } from '../../../src/models/visita.model.js';

// Mock de la conexión Sequelize
jest.mock('../../../src/database/conexion.js', () => ({
  sequelize: {
    define: jest.fn((modelName, attributes, options) => ({
      modelName,
      attributes,
      options,
    })),
  },
}));

describe('VisitaModel', () => {
  let Visita;

  beforeAll(() => {
    Visita = VisitaModel.Visita;
  });

  it('debería definir correctamente el modelo Visita', () => {
    expect(Visita.modelName).toBe('Visita');
    expect(Visita.options.tableName).toBe('visitas');
    expect(Visita.options.timestamps).toBe(false);
  });

  it('debería tener todos los campos definidos correctamente', () => {
    const fields = [
      'id',
      'fecha_programada',
      'duracion_estimada',
      'estado',
      'notas_previas',
      'notas_posteriores',
      'fecha_creacion',
      'solicitud_id_fk',
      'tecnico_id_fk',
      'servicio_id_fk'
    ];

    fields.forEach(field => {
      expect(Visita.attributes[field]).toBeDefined();
    });

    expect(Visita.attributes.id.primaryKey).toBe(true);
    expect(Visita.attributes.estado.defaultValue).toBe('programada');
    expect(Visita.attributes.duracion_estimada.defaultValue).toBe(60);
  });

  // ---------------------- VALIDACIONES DE FECHA PROGRAMADA ----------------------
  describe('Validaciones de fecha_programada', () => {
    let validate;
    beforeAll(() => {
      validate = Visita.attributes.fecha_programada.validate;
    });

    it('debería lanzar error si la fecha no es válida', () => {
      expect(validate.isDate.msg).toBe('La fecha programada debe ser una fecha válida');
    });

    it('debería lanzar error si la fecha es anterior a la actual', () => {
      const fechaPasada = new Date(Date.now() - 24 * 60 * 60 * 1000); // Ayer
      expect(() => validate.notInPast(fechaPasada)).toThrow('La fecha no puede ser anterior a la fecha actual');
    });

    it('no debería lanzar error si la fecha es futura', () => {
      const fechaFutura = new Date(Date.now() + 24 * 60 * 60 * 1000); // Mañana
      expect(() => validate.notInPast(fechaFutura)).not.toThrow();
    });
  });

  // ---------------------- VALIDACIONES DE DURACIÓN ESTIMADA ----------------------
  describe('Validaciones de duracion_estimada', () => {
    let validate;
    beforeAll(() => {
      validate = Visita.attributes.duracion_estimada.validate;
    });

    it('debería tener un mínimo de 15 minutos', () => {
      expect(validate.min.args[0]).toBe(15);
      expect(validate.min.msg).toBe('La duración mínima es de 15 minutos');
    });

    it('debería tener un máximo de 480 minutos', () => {
      expect(validate.max.args[0]).toBe(480);
      expect(validate.max.msg).toBe('La duración máxima es de 8 horas (480 minutos)');
    });
  });

  // ---------------------- VALIDACIONES DE NOTAS ----------------------
  describe('Validaciones de notas_previas', () => {
    let validate;
    beforeAll(() => {
      validate = Visita.attributes.notas_previas.validate;
    });

    it('debería tener una longitud máxima de 250 caracteres', () => {
      expect(validate.len.args[1]).toBe(250);
      expect(validate.len.msg).toBe('Las notas no pueden exceder los 250 caracteres');
    });
  });

  // ---------------------- VALIDACIONES DE CLAVES FORÁNEAS ----------------------
  describe('Validaciones de claves foráneas', () => {
    it('debería tener referencia a solicitudes, tecnico y servicios', () => {
      const { solicitud_id_fk, tecnico_id_fk, servicio_id_fk } = Visita.attributes;

      expect(solicitud_id_fk.references.model).toBe('solicitudes');
      expect(tecnico_id_fk.references.model).toBe('tecnico');
      expect(servicio_id_fk.references.model).toBe('servicios');
    });

    it('todas las claves foráneas deberían ser obligatorias', () => {
      expect(Visita.attributes.solicitud_id_fk.allowNull).toBe(false);
      expect(Visita.attributes.tecnico_id_fk.allowNull).toBe(false);
      expect(Visita.attributes.servicio_id_fk.allowNull).toBe(false);
    });
  });

  // ---------------------- VALIDACIÓN DE ÍNDICES ----------------------
  it('debería tener índices definidos para campos clave', () => {
    const indexes = Visita.options.indexes.map(idx => idx.fields).flat();

    expect(indexes).toContain('fecha_programada');
    expect(indexes).toContain('tecnico_id_fk');
    expect(indexes).toContain('solicitud_id_fk');
    expect(indexes).toContain('servicio_id_fk');
  });
});
