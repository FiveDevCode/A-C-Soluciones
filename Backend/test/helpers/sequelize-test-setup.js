import dotenv from 'dotenv';
dotenv.config();


import { Sequelize } from 'sequelize';
import defineUsuarioModel from '../../src/models/usuario.model.js'; 

// Usar la URL de conexión a PostgreSQL
const sequelizeTestInstance = new Sequelize(process.env.DATABASE_URL, { logging: false });
const Usuario = defineUsuarioModel(sequelizeTestInstance);

async function setupDatabase() {
  // Sincroniza la base de datos de prueba con PostgreSQL
  await sequelizeTestInstance.sync({ force: true });
}

export { sequelizeTestInstance, Usuario, setupDatabase };
