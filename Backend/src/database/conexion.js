// configuracion de la conexion a la base de datos, este archivo no debe ser modificado

import { Sequelize } from 'sequelize';
import 'dotenv/config';


export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 10,          // Máximo de conexiones en el pool
    min: 2,           // Mínimo de conexiones siempre disponibles
    acquire: 30000,   // Tiempo máximo para obtener una conexión (30s)
    idle: 10000,      // Tiempo máximo que una conexión puede estar inactiva (10s)
  },
  dialectOptions: {
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  },
});


export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado correctamente a la base de datos');
    
  } catch (error) {
    console.error('Error al conectarse a la base de datos:', error);
    process.exit(1);
  }
};

