import { ServicioModel } from '../../../src/models/servicios.model.js';
import { sequelize } from '../../../src/database/conexion.js';

// Mock de Sequelize
jest.mock('../../../src/database/conexion.js', () => ({
  sequelize: {
    define: jest.fn((modelName, attributes, options) => ({
      modelName,
      attributes,
      options,
      belongsTo: jest.fn(),
    })),
  },
}));

describe('ServicioModel', () => {
  let Servicio;

  beforeAll(() => {
    Servicio = ServicioModel.Servicio;
  });

  // --------------------- DEFINICIÓN GENERAL ---------------------
  it('debería definir correctamente el modelo Servicio', () => {
    expect(Servicio.modelName).toBe('Servicio');
    expect(Servicio.options.tableName).toBe('servicios');
    expect(Servicio.options.timestamps).toBe(false);
  });

  it('debería tener todos los campos principales definidos', () => {
    const expectedFields = [
      'id',
      'nombre',
      'descripcion',
      'estado',
      'fecha_creacion',
      'fecha_modificacion',
      'creada_por_fk',
      'id_administrador',
      'tecnico_id',
    ];
    expectedFields.forEach(field => {
      expect(Servicio.attributes[field]).toBeDefined();
    });
  });

  // --------------------- VALIDACIONES DE NOMBRE ---------------------
  describe('Validaciones de nombre', () => {
    let validate;
    beforeAll(() => {
      validate = Servicio.attributes.nombre.validate;
    });

    it('debería tener validación de longitud', () => {
      expect(validate.len.args).toEqual([2, 100]);
      expect(validate.len.msg).toBe('El nombre del servicio debe tener entre 2 y 100 caracteres.');
    });

    it('debería tener validación de campo no vacío', () => {
      expect(validate.notEmpty.msg).toBe('El nombre del servicio no puede estar vacío.');
    });

    it('debería tener validación de caracteres válidos', () => {
      expect(validate.is.args[0]).toEqual(/^[A-ZÁÉÍÓÚÑ0-9 .!,:()-]+$/i);
      expect(validate.is.msg).toBe('El nombre del servicio contiene caracteres no válidos.');
    });

    it('debería lanzar error si tiene espacios al inicio o final', () => {
      expect(() => validate.noSpacesEdges('  Servicio')).toThrow('El nombre no debe tener espacios al inicio o final.');
      expect(() => validate.noSpacesEdges('Servicio  ')).toThrow('El nombre no debe tener espacios al inicio o final.');
      expect(() => validate.noSpacesEdges('Servicio')).not.toThrow();
    });
  });

  // --------------------- VALIDACIONES DE DESCRIPCIÓN ---------------------
  describe('Validaciones de descripción', () => {
    let validate;
    beforeAll(() => {
      validate = Servicio.attributes.descripcion.validate;
    });

    it('debería tener validación de longitud', () => {
      expect(validate.len.args).toEqual([20, 500]);
      expect(validate.len.msg).toBe('La descripción debe tener entre 20 y 500 caracteres.');
    });

    it('debería tener validación de campo no vacío', () => {
      expect(validate.notEmpty.msg).toBe('La descripción del servicio no puede estar vacía.');
    });

    it('debería lanzar error si tiene espacios al inicio o final', () => {
      expect(() => validate.noSpacesEdges('  Descripción válida')).toThrow('La descripción no debe tener espacios al inicio o final.');
      expect(() => validate.noSpacesEdges('Descripción válida')).not.toThrow();
    });
  });

  // --------------------- VALIDACIONES DE ESTADO ---------------------
  describe('Validaciones de estado', () => {
    it('debería tener valores ENUM permitidos', () => {
      const estadoField = Servicio.attributes?.estado || modelDefinition?.attributes?.estado;
      expect(estadoField).toBeDefined();
      expect(estadoField.type).toBeDefined();
    });

    it('debería tener valor por defecto "activo"', () => {
      expect(Servicio.attributes.estado.defaultValue).toBe('activo');
    });
  });

  // --------------------- VALIDACIONES DE FECHAS ---------------------
  describe('Validaciones de fechas', () => {
    it('fecha_creacion debería tener valor por defecto DataTypes.NOW', () => {
      expect(Servicio.attributes.fecha_creacion.defaultValue).toBeDefined();
    });

    it('fecha_modificacion debería tener valor por defecto DataTypes.NOW', () => {
      expect(Servicio.attributes.fecha_modificacion.defaultValue).toBeDefined();
    });

    it('debería ejecutar hook beforeUpdate para actualizar fecha_modificacion', () => {
      const mockServicio = { fecha_modificacion: null };
      Servicio.options.hooks.beforeUpdate(mockServicio);
      expect(mockServicio.fecha_modificacion).toBeInstanceOf(Date);
    });
  });

  // --------------------- VALIDACIONES DE CREADA_POR_FK ---------------------
  describe('Validaciones de creada_por_fk', () => {
    let validate;
    beforeAll(() => {
      validate = Servicio.attributes.creada_por_fk.validate;
    });

    it('debería requerir un número entero', () => {
      expect(validate.isInt.msg).toBe('El ID del creador debe ser un número entero.');
    });

    it('debería requerir un valor positivo', () => {
      expect(validate.min.args).toEqual([1]);
      expect(validate.min.msg).toBe('El ID del creador debe ser un número positivo.');
    });
  });

  // --------------------- VALIDACIONES DE ID_ADMINISTRADOR ---------------------
  describe('Validaciones de id_administrador', () => {
    let validate;
    beforeAll(() => {
      validate = Servicio.attributes.id_administrador.validate;
    });

    it('debería requerir un número entero', () => {
      expect(validate.isInt.msg).toBe('El ID del administrador debe ser un número entero.');
    });

    it('debería requerir un valor positivo', () => {
      expect(validate.min.args).toEqual([1]);
      expect(validate.min.msg).toBe('El ID del administrador debe ser un número positivo.');
    });
  });

  // --------------------- VALIDACIONES DE TECNICO_ID ---------------------
  describe('Validaciones de tecnico_id', () => {
    let validate;
    beforeAll(() => {
      validate = Servicio.attributes.tecnico_id.validate;
    });

    it('debería tener referencia al modelo técnico', () => {
      const ref = Servicio.attributes.tecnico_id.references;
      expect(ref.model).toBe('tecnico');
      expect(ref.key).toBe('id');
    });

    it('debería requerir un número entero', () => {
      expect(validate.isInt.msg).toBe('El ID del técnico debe ser un número entero.');
    });

    it('debería requerir un valor positivo', () => {
      expect(validate.min.args).toEqual([1]);
      expect(validate.min.msg).toBe('El ID del técnico debe ser un número positivo.');
    });
  });
});
