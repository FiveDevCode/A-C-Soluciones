import { jest } from '@jest/globals';
import { Notificacion } from '../../../src/models/notificacion.model.js';
import { sequelize } from '../../../src/database/conexion.js';

jest.mock('../../../src/database/conexion.js', () => ({
  sequelize: {
    define: jest.fn().mockReturnValue({})
  }
}));

describe('Notificacion Model Tests', () => {
  let modelDefinition;

  beforeEach(() => {
    jest.clearAllMocks();

    sequelize.define.mockImplementation((modelName, attributes, options) => {
      modelDefinition = { modelName, attributes, options };
      return {};
    });

    jest.isolateModules(() => {
      require('../../../src/models/notificacion.model.js');
    });
  });

  test('Debe definir el modelo Notificacion con el nombre de tabla correcto', () => {
    expect(modelDefinition.options.tableName).toBe('notificaciones');
    expect(modelDefinition.options.timestamps).toBe(true);
    expect(modelDefinition.options.createdAt).toBe('created_at');
    expect(modelDefinition.options.updatedAt).toBe('updated_at');
  });

  test('Debe tener el campo id_notificacion como primaryKey y autoIncrement', () => {
    const idField = modelDefinition.attributes.id_notificacion;
    expect(idField.primaryKey).toBe(true);
    expect(idField.autoIncrement).toBe(true);
    expect(idField.allowNull).toBe(false);
  });

  describe('Validaciones de id_destinatario', () => {
    let idDestinatarioField;

    beforeEach(() => {
      idDestinatarioField = modelDefinition.attributes.id_destinatario;
    });

    test('debe ser requerido', () => {
      expect(idDestinatarioField.allowNull).toBe(false);
    });

    test('debe validar que sea un número entero', () => {
      expect(idDestinatarioField.validate.isInt).toBeDefined();
      expect(idDestinatarioField.validate.isInt.msg).toBe('El ID del destinatario debe ser un número entero.');
    });

    test('debe validar que sea mayor a 0', () => {
      expect(idDestinatarioField.validate.min).toBeDefined();
      expect(idDestinatarioField.validate.min.args).toEqual([1]);
      expect(idDestinatarioField.validate.min.msg).toBe('El ID del destinatario debe ser mayor a 0.');
    });
  });

  describe('Validaciones de tipo_destinatario', () => {
    let tipoDestinatarioField;

    beforeEach(() => {
      tipoDestinatarioField = modelDefinition.attributes.tipo_destinatario;
    });

    test('debe ser requerido', () => {
      expect(tipoDestinatarioField.allowNull).toBe(false);
    });

    test('debe validar valores permitidos', () => {
      expect(tipoDestinatarioField.validate.isIn).toBeDefined();
      expect(tipoDestinatarioField.validate.isIn.args).toEqual([['cliente', 'administrador', 'tecnico']]);
      expect(tipoDestinatarioField.validate.isIn.msg).toBe('El tipo de destinatario debe ser: cliente, administrador o tecnico.');
    });
  });

  describe('Validaciones de tipo_notificacion', () => {
    let tipoNotificacionField;

    beforeEach(() => {
      tipoNotificacionField = modelDefinition.attributes.tipo_notificacion;
    });

    test('debe ser requerido', () => {
      expect(tipoNotificacionField.allowNull).toBe(false);
    });

    test('debe validar que no esté vacío', () => {
      expect(tipoNotificacionField.validate.notEmpty).toBeDefined();
      expect(tipoNotificacionField.validate.notEmpty.msg).toBe('El tipo de notificación no puede estar vacío.');
    });

    test('debe validar longitud entre 3 y 50 caracteres', () => {
      expect(tipoNotificacionField.validate.len).toBeDefined();
      expect(tipoNotificacionField.validate.len.args).toEqual([3, 50]);
      expect(tipoNotificacionField.validate.len.msg).toBe('El tipo de notificación debe tener entre 3 y 50 caracteres.');
    });
  });

  describe('Validaciones de mensaje', () => {
    let mensajeField;

    beforeEach(() => {
      mensajeField = modelDefinition.attributes.mensaje;
    });

    test('debe ser requerido', () => {
      expect(mensajeField.allowNull).toBe(false);
    });

    test('debe validar que no esté vacío', () => {
      expect(mensajeField.validate.notEmpty).toBeDefined();
      expect(mensajeField.validate.notEmpty.msg).toBe('El mensaje no puede estar vacío.');
    });

    test('debe validar longitud máxima de 1000 caracteres', () => {
      expect(mensajeField.validate.len).toBeDefined();
      expect(mensajeField.validate.len.args).toEqual([1, 1000]);
      expect(mensajeField.validate.len.msg).toBe('El mensaje no debe exceder los 1000 caracteres.');
    });
  });

  describe('Validaciones de id_referencia', () => {
    let idReferenciaField;

    beforeEach(() => {
      idReferenciaField = modelDefinition.attributes.id_referencia;
    });

    test('debe ser opcional', () => {
      expect(idReferenciaField.allowNull).toBe(true);
    });

    test('debe validar que sea un número entero si se proporciona', () => {
      expect(idReferenciaField.validate.isInt).toBeDefined();
      expect(idReferenciaField.validate.isInt.msg).toBe('El ID de referencia debe ser un número entero.');
    });

    test('debe validar que sea mayor a 0 si se proporciona', () => {
      expect(idReferenciaField.validate.min).toBeDefined();
      expect(idReferenciaField.validate.min.args).toEqual([1]);
      expect(idReferenciaField.validate.min.msg).toBe('El ID de referencia debe ser mayor a 0.');
    });
  });

  describe('Validaciones de tipo_referencia', () => {
    let tipoReferenciaField;

    beforeEach(() => {
      tipoReferenciaField = modelDefinition.attributes.tipo_referencia;
    });

    test('debe ser opcional', () => {
      expect(tipoReferenciaField.allowNull).toBe(true);
    });

    test('debe validar longitud máxima de 50 caracteres', () => {
      expect(tipoReferenciaField.validate.len).toBeDefined();
      expect(tipoReferenciaField.validate.len.args).toEqual([0, 50]);
      expect(tipoReferenciaField.validate.len.msg).toBe('El tipo de referencia no debe exceder los 50 caracteres.');
    });
  });

  describe('Campo leida', () => {
    let leidaField;

    beforeEach(() => {
      leidaField = modelDefinition.attributes.leida;
    });

    test('debe ser requerido', () => {
      expect(leidaField.allowNull).toBe(false);
    });

    test('debe tener valor por defecto false', () => {
      expect(leidaField.defaultValue).toBe(false);
    });
  });

  describe('Campo fecha_creacion', () => {
    let fechaCreacionField;

    beforeEach(() => {
      fechaCreacionField = modelDefinition.attributes.fecha_creacion;
    });

    test('debe ser requerido', () => {
      expect(fechaCreacionField.allowNull).toBe(false);
    });

    test('debe tener valor por defecto NOW', () => {
      expect(fechaCreacionField.defaultValue).toBeDefined();
    });
  });

  describe('Índices', () => {
    test('debe tener índice para destinatario', () => {
      const indexes = modelDefinition.options.indexes;
      const destinatarioIndex = indexes.find(idx => idx.name === 'idx_notificaciones_destinatario');
      
      expect(destinatarioIndex).toBeDefined();
      expect(destinatarioIndex.fields).toEqual(['id_destinatario', 'tipo_destinatario']);
    });

    test('debe tener índice para leida', () => {
      const indexes = modelDefinition.options.indexes;
      const leidaIndex = indexes.find(idx => idx.name === 'idx_notificaciones_leida');
      
      expect(leidaIndex).toBeDefined();
      expect(leidaIndex.fields).toEqual(['leida']);
    });

    test('debe tener índice para fecha_creacion', () => {
      const indexes = modelDefinition.options.indexes;
      const fechaIndex = indexes.find(idx => idx.name === 'idx_notificaciones_fecha');
      
      expect(fechaIndex).toBeDefined();
      expect(fechaIndex.fields).toEqual([{ name: 'fecha_creacion', order: 'DESC' }]);
    });

    test('debe tener índice para tipo_notificacion', () => {
      const indexes = modelDefinition.options.indexes;
      const tipoIndex = indexes.find(idx => idx.name === 'idx_notificaciones_tipo');
      
      expect(tipoIndex).toBeDefined();
      expect(tipoIndex.fields).toEqual(['tipo_notificacion']);
    });

    test('debe tener índice compuesto para usuario_no_leidas', () => {
      const indexes = modelDefinition.options.indexes;
      const compuestoIndex = indexes.find(idx => idx.name === 'idx_notificaciones_usuario_no_leidas');
      
      expect(compuestoIndex).toBeDefined();
      expect(compuestoIndex.fields).toEqual([
        'id_destinatario',
        'tipo_destinatario',
        'leida',
        { name: 'fecha_creacion', order: 'DESC' }
      ]);
    });

    test('debe tener exactamente 5 índices', () => {
      const indexes = modelDefinition.options.indexes;
      expect(indexes).toHaveLength(5);
    });
  });
});
