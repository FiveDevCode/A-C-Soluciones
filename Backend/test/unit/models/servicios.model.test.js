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

  test('El campo nombre no debe tener espacios al inicio o final', async () => {
    const servicio = modelDefinition.build({ nombre: ' Limpieza ' });
    try {
      await servicio.validate();
    } catch (error) {
      expect(error.message).toContain('El nombre no debe tener espacios al inicio o final.');
    }
  });

  test('El campo descripcion no debe tener espacios al inicio o final', async () => {
    const servicio = modelDefinition.build({ descripcion: ' Servicio de limpieza ' });
    try {
      await servicio.validate();
    } catch (error) {
      expect(error.message).toContain('La descripción no debe tener espacios al inicio o final.');
    }
  });

  test('El hook beforeUpdate debe actualizar la fecha_modificacion antes de actualizar el servicio', async () => {
    // Crear un servicio de prueba
    const servicio = await modelDefinition.create({
      nombre: 'Limpieza',
      descripcion: 'Servicio de limpieza con más de 20 caracteres para cumplir validación',
      creada_por_fk: 1,
    });

    // Almacenar la fecha original de creación
    const fechaCreacion = new Date(servicio.fecha_creacion);
    
    
    const fechaAnterior = new Date(fechaCreacion.getTime() - 60000);
    servicio.fecha_modificacion = fechaAnterior;
    
    // Modificar el servicio
    servicio.nombre = 'Limpieza profunda';
    
    // Guardar los cambios usando update directo en lugar de save
    await modelDefinition.update(
      { nombre: 'Limpieza profunda' },
      { where: { id: servicio.id }, individualHooks: true }
    );
    
    // Recargar el servicio desde la base de datos para obtener los valores actualizados
    const servicioActualizado = await modelDefinition.findByPk(servicio.id);
    
    // Verificar que la fecha de modificación sea posterior a la fecha de creación
    expect(new Date(servicioActualizado.fecha_modificacion).getTime())
      .not.toEqual(fechaCreacion.getTime());
    expect(new Date(servicioActualizado.fecha_modificacion).getTime())
      .toBeGreaterThan(fechaCreacion.getTime());
  }, 20000); 

  test('El modelo Servicio se exporta correctamente', () => {
    expect(ServicioModel.Servicio).toBeDefined();
  });
});