// test/unit/models/servicios.model.test.js
import { ServicioModel } from '../../../src/models/servicios.model.js';

const modelDefinition = ServicioModel.Servicio;
const attrs = modelDefinition.rawAttributes;

describe('Servicio Model Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Debe definir el modelo con el nombre "Servicio"', () => {
    expect(modelDefinition.name).toBe('Servicio');
    expect(modelDefinition.options.tableName).toBe('servicios');
  });

  test('Debe tener todos los campos necesarios definidos', () => {
    expect(attrs).toHaveProperty('id');
    expect(attrs).toHaveProperty('nombre');
    expect(attrs).toHaveProperty('descripcion');
    expect(attrs).toHaveProperty('estado');
    expect(attrs).toHaveProperty('fecha_creacion');
    expect(attrs).toHaveProperty('fecha_modificacion');
    expect(attrs).toHaveProperty('creada_por_fk');
    expect(attrs).toHaveProperty('id_administrador');
  });

  test('Campo estado debe tener valores ENUM correctos', () => {
    const estado = attrs.estado;
    expect(estado.type.values).toEqual(['activo', 'inactivo']);
    expect(estado.defaultValue).toBe('activo');
    expect(estado.allowNull).toBe(false);
  });

  test('Campo descripcion debe tener restricciones de longitud y no permitir nulos', () => {
    const desc = attrs.descripcion;
    expect(desc.allowNull).toBe(false);
    expect(desc.validate.notEmpty).toBeDefined();
    expect(desc.validate.len.args).toEqual([20, 500]);
  });

  test('Campo nombre debe tener restricciones correctas', () => {
    const nombre = attrs.nombre;
    expect(nombre.allowNull).toBe(false);
    expect(nombre.unique).toBe(true);
    expect(nombre.validate.notEmpty).toBeDefined();
    expect(nombre.validate.len.args).toEqual([2, 100]);
  });

  test('Campo fecha_creacion debe tener valor por defecto como NOW', () => {
    const fecha = attrs.fecha_creacion;
    expect(fecha.defaultValue?.toString?.()).toContain('NOW');
  });

  test('Campo fecha_modificacion debe tener valor por defecto como NOW', () => {
    const fecha = attrs.fecha_modificacion;
    expect(fecha.defaultValue?.toString?.()).toContain('NOW');
  });

  test('Campo creada_por_fk debe estar definido correctamente', () => {
    const creador = attrs.creada_por_fk;
    expect(creador.allowNull).toBe(false);
    expect(creador.validate.isInt).toBeDefined();
    expect(creador.validate.min.args[0]).toBe(1);
  });

  test('Campo id_administrador debe estar definido correctamente', () => {
    const admin = attrs.id_administrador;
    expect(admin.allowNull).toBe(true);
    expect(admin.validate.isInt).toBeDefined();
    expect(admin.validate.min.args[0]).toBe(1);
  });
});
