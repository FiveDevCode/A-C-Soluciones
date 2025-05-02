// src/models/index.js
import { sequelize } from '../database/conexion.js';
import defineUsuario from './usuario.model.js';

// Inicializar modelos
const Usuario = defineUsuario(sequelize);

// Si tienes más modelos, los defines aquí igual:
// const OtroModelo = defineOtroModelo(sequelize);

// Exportar todos los modelos inicializados
export { Usuario };

// También puedes exportar sequelize si quieres usarlo desde aquí
export { sequelize };
