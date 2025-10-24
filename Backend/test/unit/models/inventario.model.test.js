import { InventarioModel } from '../../../src/models/inventario.model.js';
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

describe('InventarioModel', () => {
  let Inventario;

  beforeAll(() => {
    Inventario = InventarioModel.Inventario;
  });

  // ------------------- DEFINICIÓN GENERAL -------------------
  it('debería definir correctamente el modelo Inventario', () => {
    expect(Inventario.modelName).toBe('Inventario');
    expect(Inventario.options.tableName).toBe('inventario');
    expect(Inventario.options.timestamps).toBe(false);
  });

  it('debería tener todos los campos principales definidos', () => {
    const expectedFields = [
      'id',
      'nombre',
      'codigo',
      'categoria',
      'cantidad_disponible',
      'estado',
      'id_administrador',
      'id_contabilidad',
      'estado_herramienta',
    ];
    expectedFields.forEach(field => {
      expect(Inventario.attributes[field]).toBeDefined();
    });
  });

  // ------------------- VALIDACIONES DE NOMBRE -------------------
  describe('Validaciones de nombre', () => {
    let validate;
    beforeAll(() => {
      validate = Inventario.attributes.nombre.validate;
    });

    it('debería validar longitud entre 3 y 100 caracteres', () => {
      expect(validate.len.args).toEqual([3, 100]);
      expect(validate.len.msg).toBe('El nombre debe tener entre 3 y 100 caracteres.');
    });

    it('debería validar solo caracteres permitidos', () => {
      expect(validate.is.args).toEqual(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9-]+$/);
      expect(validate.is.msg).toBe('El nombre solo puede contener letras, números, espacios y guiones (-).');
    });

    it('debería mapear correctamente al campo nombre_herramienta', () => {
      expect(Inventario.attributes.nombre.field).toBe('nombre_herramienta');
    });
  });

  // ------------------- VALIDACIONES DE CÓDIGO -------------------
  describe('Validaciones de código', () => {
    let validate;
    beforeAll(() => {
      validate = Inventario.attributes.codigo.validate;
    });

    it('debería validar longitud entre 3 y 20 caracteres', () => {
      expect(validate.len.args).toEqual([3, 20]);
      expect(validate.len.msg).toBe('El código debe tener entre 3 y 20 caracteres.');
    });

    it('debería validar solo caracteres alfanuméricos', () => {
      expect(validate.isAlphanumeric.msg).toBe('El código solo puede contener caracteres alfanuméricos.');
    });

    it('debería tener restricción de unicidad con mensaje personalizado', () => {
      expect(Inventario.attributes.codigo.unique.msg).toBe(
        'El código de herramienta ya está registrado. Ingrese uno diferente.'
      );
    });
  });

  // ------------------- VALIDACIONES DE CATEGORÍA -------------------
  describe('Validaciones de categoría', () => {
    let validate;
    beforeAll(() => {
      validate = Inventario.attributes.categoria.validate;
    });

    it('debería validar que no esté vacía', () => {
      expect(validate.notEmpty.msg).toBe('La categoría no puede estar vacía o en la opción por defecto.');
    });

    it('debería validar que pertenezca a las categorías permitidas', () => {
      const categorias = [
        'electricas',
        'manuales',
        'medicion',
        'neumaticas',
        'jardineria',
        'seguridad',
        'otras',
      ];
      expect(validate.isIn.args[0]).toEqual(categorias);
    expect(validate.isIn.msg).toBe('La categoría seleccionada no es válida.');
    });
  });

  // ------------------- VALIDACIONES DE CANTIDAD DISPONIBLE -------------------
  describe('Validaciones de cantidad_disponible', () => {
    let validate;
    beforeAll(() => {
      validate = Inventario.attributes.cantidad_disponible.validate;
    });

    it('debería validar cantidad mínima de 1', () => {
      expect(validate.min.args).toBe(1);
      expect(validate.min.msg).toBe('La cantidad disponible debe ser mínimo 1.');
    });

    it('debería validar cantidad máxima de 9999', () => {
      expect(validate.max.args).toBe(9999);
      expect(validate.max.msg).toBe('La cantidad disponible debe ser máximo 9999.');
    });

    it('debería validar que sea un número entero', () => {
      expect(validate.isInt.msg).toBe('La cantidad debe ser un número entero.');
    });
  });

  // ------------------- VALIDACIONES DE ESTADO -------------------
  describe('Validaciones de estado', () => {
    it('debería tener valor por defecto "Nueva"', () => {
      expect(Inventario.attributes.estado.defaultValue).toBe('Nueva');
    });

    it('debería ser obligatorio', () => {
      expect(Inventario.attributes.estado.allowNull).toBe(false);
    });
  });

  // ------------------- VALIDACIONES DE ESTADO_HERRAMIENTA -------------------
  describe('Validaciones de estado_herramienta', () => {
    let validate;
    beforeAll(() => {
      validate = Inventario.attributes.estado_herramienta.validate;
    });

    it('debería tener valor por defecto "activo"', () => {
      expect(Inventario.attributes.estado_herramienta.defaultValue).toBe('activo');
    });

    it('debería validar que solo acepte "activo" o "inactivo"', () => {
      expect(validate.isIn.args[0]).toEqual(['activo', 'inactivo']);
      expect(validate.isIn.msg).toBe('El estado de la herramienta debe ser "activo" o "inactivo".')
    });
  });

  // ------------------- VALIDACIONES DE RELACIONES -------------------
  describe('Relaciones con otras tablas', () => {
    it('id_administrador debería permitir nulos', () => {
      expect(Inventario.attributes.id_administrador.allowNull).toBe(true);
    });

    it('id_contabilidad debería permitir nulos', () => {
      expect(Inventario.attributes.id_contabilidad.allowNull).toBe(true);
    });
  });
});
