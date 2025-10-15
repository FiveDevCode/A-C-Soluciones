
import { DataTypes } from 'sequelize';
import { RegistroFacturaModel } from '../../../src/models/registrar_facturas.model.js';

// Extraemos el modelo para facilitar las pruebas
const { RegistroFactura } = RegistroFacturaModel;

describe('RegistroFactura Model', () => {
  // Prueba para verificar la definición del modelo
  it('debe tener el nombre correcto y la tabla correcta', () => {
    expect(RegistroFactura.name).toBe('RegistroFactura');
    expect(RegistroFactura.tableName).toBe('registrofactura');
  });

  // Prueba para verificar los atributos del modelo
  it('debe tener los atributos correctos con sus tipos y validaciones', () => {
    const attributes = RegistroFactura.getAttributes();

    // Verificamos cada atributo
    expect(attributes.id.type).toBeInstanceOf(DataTypes.INTEGER);
    expect(attributes.id.primaryKey).toBe(true);
    expect(attributes.id.autoIncrement).toBe(true);

    expect(attributes.fecha_factura.type).toBeInstanceOf(DataTypes.DATEONLY);
    expect(attributes.fecha_factura.allowNull).toBe(false);

    expect(attributes.numero_factura.type).toBeInstanceOf(DataTypes.STRING);
    expect(attributes.numero_factura.allowNull).toBe(false);
    expect(attributes.numero_factura.unique).toBe(true);

    expect(attributes.monto_facturado.type).toBeInstanceOf(DataTypes.DECIMAL);
    expect(attributes.monto_facturado.allowNull).toBe(false);

    expect(attributes.saldo_pendiente.type).toBeInstanceOf(DataTypes.DECIMAL);
    expect(attributes.saldo_pendiente.allowNull).toBe(false);

    expect(attributes.estado_factura.type).toBeInstanceOf(DataTypes.ENUM);
    expect(attributes.estado_factura.values).toEqual(['pendiente', 'pagada', 'vencida']);
    expect(attributes.estado_factura.defaultValue).toBe('pendiente');
  });

  // Prueba para verificar las asociaciones
  it('debe tener las asociaciones correctas', () => {
    const associations = RegistroFactura.associations;

    // Verificamos que las asociaciones existan
    expect(associations.cliente).toBeDefined();
    expect(associations.administrador).toBeDefined();
    expect(associations.contabilidad).toBeDefined();

    // Verificamos el tipo de asociación y la clave foránea
    expect(associations.cliente.associationType).toBe('BelongsTo');
    expect(associations.cliente.foreignKey).toBe('id_cliente');

    expect(associations.administrador.associationType).toBe('BelongsTo');
    expect(associations.administrador.foreignKey).toBe('id_admin');

    expect(associations.contabilidad.associationType).toBe('BelongsTo');
    expect(associations.contabilidad.foreignKey).toBe('id_contabilidad');
  });
});
