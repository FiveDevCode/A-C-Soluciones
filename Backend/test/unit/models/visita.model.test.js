import { DataTypes } from 'sequelize';
import { VisitaModel } from '../../../src/models/visita.model.js';

// Extraemos el modelo para facilitar las pruebas
const { Visita } = VisitaModel;

describe('Visita Model', () => {
  // Verificar definición básica del modelo
  it('debe tener el nombre correcto y la tabla correcta', () => {
    expect(Visita.name).toBe('Visita');
    expect(Visita.tableName).toBe('visitas');
  });

  // Verificar atributos del modelo
  it('debe tener los atributos correctos con sus tipos y validaciones', () => {
    const attributes = Visita.getAttributes();

    // id
    expect(attributes.id.type).toBeInstanceOf(DataTypes.INTEGER);
    expect(attributes.id.primaryKey).toBe(true);
    expect(attributes.id.autoIncrement).toBe(true);

    // fecha_programada
    expect(attributes.fecha_programada.type).toBeInstanceOf(DataTypes.DATE);
    expect(attributes.fecha_programada.allowNull).toBe(false);

    // duracion_estimada
    expect(attributes.duracion_estimada.type).toBeInstanceOf(DataTypes.INTEGER);
    expect(attributes.duracion_estimada.allowNull).toBe(false);

    // estado
    expect(attributes.estado.type).toBeInstanceOf(DataTypes.ENUM);
    expect(attributes.estado.values).toEqual([
      'programada',
      'en progreso',
      'completada',
      'cancelada'
    ]);
    expect(attributes.estado.defaultValue).toBe('programada');

    // notas_previas
    expect(attributes.notas_previas.type).toBeInstanceOf(DataTypes.STRING);
    expect(attributes.notas_previas.allowNull).toBe(true);

    // notas_posteriores
    expect(attributes.notas_posteriores.type).toBeInstanceOf(DataTypes.STRING);
    expect(attributes.notas_posteriores.allowNull).toBe(true);

    // fecha_creacion
    expect(attributes.fecha_creacion.type).toBeInstanceOf(DataTypes.DATE);
    expect(attributes.fecha_creacion.defaultValue).toBeInstanceOf(Function);

    // claves foráneas
    expect(attributes.solicitud_id_fk.type).toBeInstanceOf(DataTypes.INTEGER);
    expect(attributes.tecnico_id_fk.type).toBeInstanceOf(DataTypes.INTEGER);
    expect(attributes.servicio_id_fk.type).toBeInstanceOf(DataTypes.INTEGER);
  });

  // Verificar asociaciones
  it('debe tener las asociaciones correctas', () => {
    const associations = Visita.associations;

    expect(associations.solicitud).toBeDefined();
    expect(associations.tecnico).toBeDefined();
    expect(associations.servicio).toBeDefined();

    expect(associations.solicitud.associationType).toBe('BelongsTo');
    expect(associations.solicitud.foreignKey).toBe('solicitud_id_fk');

    expect(associations.tecnico.associationType).toBe('BelongsTo');
    expect(associations.tecnico.foreignKey).toBe('tecnico_id_fk');

    expect(associations.servicio.associationType).toBe('BelongsTo');
    expect(associations.servicio.foreignKey).toBe('servicio_id_fk');
  });
});
