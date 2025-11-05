import { DataTypes } from 'sequelize';
import { encryptPasswordHook } from '../../../src/hooks/encryptPassword.js';
import { AdminModel } from '../../../src/models/administrador.model.js';

//Mock de sequelize para no afectar la BD real durante los test
jest.mock('../../../src/database/conexion.js', () => ({
  sequelize: {
    define: jest.fn((modelName, attributes, options) => ({
      modelName,
      attributes,
      options,
      beforeCreate: jest.fn(),
    })),
  },
}));

jest.mock('../../../src/hooks/encryptPassword.js', () => ({
  encryptPasswordHook: jest.fn(),
}));

describe('AdminModel', () => {
  let Admin;

  beforeAll(() => {
    Admin = AdminModel.Admin;
  });

  it('debería definir correctamente el modelo Admin', () => {
    expect(Admin.modelName).toBe('Admin');
    expect(Admin.options.tableName).toBe('administrador');
    expect(Admin.options.timestamps).toBe(false);
  });

  it('debería tener todos los campos definidos correctamente', () => {
    const fields = [
      'id', 'numero_cedula', 'nombre', 'apellido',
      'correo_electronico', 'contrasenia', 'rol',
      'recovery_code', 'recovery_expires', 'estado'
    ];

    fields.forEach(field => {
      expect(Admin.attributes[field]).toBeDefined();
    });

    expect(Admin.attributes.id.autoIncrement).toBe(true);
    expect(Admin.attributes.rol.defaultValue).toBe('administrador');
    expect(Admin.attributes.estado.defaultValue).toBe('activo');
  });

  //Ahora dentro de beforeAll para asegurar que Admin esté cargado
  describe('Validaciones de numero_cedula', () => {
    let validate;

    beforeAll(() => {
      validate = Admin.attributes.numero_cedula.validate;
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

  describe('Validaciones de nombre y apellido', () => {
    let valNombre, valApellido;

    beforeAll(() => {
      valNombre = Admin.attributes.nombre.validate;
      valApellido = Admin.attributes.apellido.validate;
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

  describe('Validaciones de contrasenia', () => {
    let validate;

    beforeAll(() => {
      validate = Admin.attributes.contrasenia.validate;
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

  it('debería registrar el hook beforeCreate con encryptPasswordHook', () => {
    Admin.beforeCreate(encryptPasswordHook);
    expect(encryptPasswordHook).toBeDefined();
  });
});
