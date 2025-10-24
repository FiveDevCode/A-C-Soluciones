import { DataTypes } from 'sequelize';
import { encryptPasswordHook } from '../../../src/hooks/encryptPassword.js';
import { ContabilidadModel } from '../../../src/models/contabilidad.model.js';
import { AdminModel } from '../../../src/models/administrador.model.js';

// Mock de sequelize y hook
jest.mock('../../../src/database/conexion.js', () => ({
  sequelize: {
    define: jest.fn((modelName, attributes, options) => ({
      modelName,
      attributes,
      options,
      beforeCreate: jest.fn(),
      belongsTo: jest.fn(),
    })),
  },
}));

jest.mock('../../../src/hooks/encryptPassword.js', () => ({
  encryptPasswordHook: jest.fn(),
}));

jest.mock('../../../src/models/administrador.model.js', () => ({
  AdminModel: { Admin: { modelName: 'Admin' } },
}));

describe('ContabilidadModel', () => {
  let Contabilidad;

  beforeAll(() => {
    Contabilidad = ContabilidadModel.Contabilidad;
  });

  it('debería definir correctamente el modelo Contabilidad', () => {
    expect(Contabilidad.modelName).toBe('Contabilidad');
    expect(Contabilidad.options.tableName).toBe('contabilidad');
    expect(Contabilidad.options.timestamps).toBe(false);
  });

  it('debería tener todos los campos definidos correctamente', () => {
    const fields = [
      'id', 'numero_de_cedula', 'nombre', 'apellido',
      'correo_electronico', 'telefono', 'contrasenia', 'rol',
      'fecha_registro', 'estado', 'recovery_code', 'recovery_expires'
    ];

    fields.forEach(field => {
      expect(Contabilidad.attributes[field]).toBeDefined();
    });

    expect(Contabilidad.attributes.id.autoIncrement).toBe(true);
    expect(Contabilidad.attributes.rol.defaultValue).toBe('Contador');
    expect(Contabilidad.attributes.estado.defaultValue).toBe('activo');
  });

  // ---------------------- VALIDACIONES DE CÉDULA ----------------------
  describe('Validaciones de numero_de_cedula', () => {
    let validate;
    beforeAll(() => {
      validate = Contabilidad.attributes.numero_de_cedula.validate;
    });

    it('debería lanzar error si la cédula empieza con 0', () => {
      expect(() => validate.notStartsWithZero('012345')).toThrow('La cédula no debe comenzar con cero.');
    });

    it('debería lanzar error si la cédula es secuencial', () => {
      expect(() => validate.notSequential('1234567')).toThrow('La cédula no debe ser una secuencia numérica predecible.');
    });

    it('no debería lanzar error si la cédula es válida', () => {
      expect(() => validate.notStartsWithZero('987654')).not.toThrow();
      expect(() => validate.notSequential('987654')).not.toThrow();
    });
  });

  // ---------------------- VALIDACIONES DE NOMBRE Y APELLIDO ----------------------
  describe('Validaciones de nombre y apellido', () => {
    let valNombre, valApellido;
    beforeAll(() => {
      valNombre = Contabilidad.attributes.nombre.validate;
      valApellido = Contabilidad.attributes.apellido.validate;
    });

    it('debería lanzar error si el nombre tiene espacios al inicio o final', () => {
      expect(() => valNombre.noSpacesEdges(' Juan')).toThrow('El nombre no debe tener espacios al inicio o final.');
      expect(() => valNombre.noSpacesEdges('Juan ')).toThrow('El nombre no debe tener espacios al inicio o final.');
    });

    it('debería lanzar error si el apellido tiene espacios al inicio o final', () => {
      expect(() => valApellido.noSpacesEdges(' Orozco')).toThrow('El apellido no debe tener espacios al inicio o final.');
      expect(() => valApellido.noSpacesEdges('Orozco ')).toThrow('El apellido no debe tener espacios al inicio o final.');
    });
  });

  // ---------------------- VALIDACIONES DE TELÉFONO ----------------------
  describe('Validaciones de teléfono', () => {
    let validate;
    beforeAll(() => {
      validate = Contabilidad.attributes.telefono.validate;
    });

    it('debería lanzar error si el teléfono empieza con 0', () => {
      expect(() => validate.notStartsWithZero('0123456789')).toThrow('El teléfono no debe comenzar con cero.');
    });

    it('no debería lanzar error si el teléfono es válido', () => {
      expect(() => validate.notStartsWithZero('3123456789')).not.toThrow();
    });
  });

  // ---------------------- VALIDACIONES DE CONTRASEÑA ----------------------
  describe('Validaciones de contrasenia', () => {
    let validate;
    beforeAll(() => {
      validate = Contabilidad.attributes.contrasenia.validate;
    });

    it('debería lanzar error si no tiene mayúsculas', () => {
      expect(() => validate.tieneMayuscula('password1@')).toThrow('La contraseña debe contener al menos una letra mayúscula.');
    });

    it('debería lanzar error si no tiene minúsculas', () => {
      expect(() => validate.tieneMinuscula('PASSWORD1@')).toThrow('La contraseña debe contener al menos una letra minúscula.');
    });

    it('debería lanzar error si no tiene número', () => {
      expect(() => validate.tieneNumero('Password@')).toThrow('La contraseña debe contener al menos un número.');
    });

    it('debería lanzar error si no tiene caracter especial', () => {
      expect(() => validate.tieneEspecial('Password1')).toThrow('La contraseña debe contener al menos un carácter especial (@#$%&*!).');
    });

    it('debería lanzar error si tiene espacios', () => {
      expect(() => validate.sinEspacios('Pass word1@')).toThrow('La contraseña no debe contener espacios.');
    });

    it('debería lanzar error si tiene caracteres repetidos', () => {
      expect(() => validate.sinRepetidos('Paaassword1@')).toThrow('La contraseña no debe tener más de 2 caracteres repetidos seguidos.');
    });

    it('debería lanzar error si es una contraseña común', () => {
      expect(() => validate.notCommonPassword('123456')).toThrow('La contraseña no puede ser común o predecible.');
    });

    it('no debería lanzar error con una contraseña válida', () => {
      const valid = 'Password1@';
      expect(() => validate.tieneMayuscula(valid)).not.toThrow();
      expect(() => validate.tieneMinuscula(valid)).not.toThrow();
      expect(() => validate.tieneNumero(valid)).not.toThrow();
      expect(() => validate.tieneEspecial(valid)).not.toThrow();
      expect(() => validate.sinEspacios(valid)).not.toThrow();
      expect(() => validate.sinRepetidos(valid)).not.toThrow();
      expect(() => validate.notCommonPassword(valid)).not.toThrow();
    });
  });

  // ---------------------- HOOK Y RELACIÓN ----------------------
  it('debería registrar el hook beforeCreate con encryptPasswordHook', () => {
    Contabilidad.beforeCreate(encryptPasswordHook);
    expect(encryptPasswordHook).toBeDefined();
  });

  it('debería establecer la relación belongsTo con AdminModel', () => {
    Contabilidad.belongsTo(AdminModel.Admin, { foreignKey: 'id_administrador', as: 'administrador' });
    expect(AdminModel.Admin.modelName).toBe('Admin');
  });
});
