// src/models/index.js
import { sequelize } from '../database/conexion.js';
import defineUsuario from './usuario.model.js';
import { SolicitudModel } from './solicitud.model.js';
import { ClienteModel } from './cliente.model.js';

// Inicializar modelos
const Usuario = defineUsuario(sequelize);

// Si tienes más modelos, los defines aquí igual:
// const OtroModelo = defineOtroModelo(sequelize);

// Exportar todos los modelos inicializados
export { Usuario };

// También puedes exportar sequelize si quieres usarlo desde aquí
export { sequelize };

Cliente.hasMany(SolicitudModel.Solicitud, {
    foreignKey: 'clienteId',
    sourceKey: 'id'
});
SolicitudModel.Solicitud.belongsTo(Cliente, {
    foreignKey: 'clienteId',
    targetKey: 'id'
});

// Exportar el modelo de solicitud
export { 
    SolicitudModel, 
    ClienteModel };
