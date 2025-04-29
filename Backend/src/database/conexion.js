import { Sequelize } from 'sequelize';
import 'dotenv/config';
import UsuarioModel from '../models/usuario.model';

// Configuración
const config = {
  production: {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  },
  development: {
    logging: console.log,
    benchmark: true  // Muestra tiempo de ejecución
  },
  test: {
    logging: false
  }
};

// Conexión principal con manejo de errores mejorado
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  ...config[process.env.NODE_ENV || 'development'],
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '5'),
    min: parseInt(process.env.DB_POOL_MIN || '0'),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
    idle: parseInt(process.env.DB_POOL_IDLE || '10000'),
    evict: parseInt(process.env.DB_POOL_EVICT || '1000')
  },
  define: {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  },
  retry: {
    max: parseInt(process.env.DB_RETRY_MAX || '3'),
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /SQLConnectionError/
    ]
  }
});

// Inicializar modelos
export const models = {
  Usuario: UsuarioModel(sequelize)
};

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida');
    
    // Verificación adicional del servidor
    const [result] = await sequelize.query('SELECT version()');
    console.log(` Versión PostgreSQL: ${result[0].version}`);
    
    return true;
  } catch (error) {
    console.error('Error de conexión:', error.message);
    throw error;
  }
};

export const syncModels = async (options = {}) => {
  const defaultOptions = {
    force: process.env.DB_FORCE_SYNC === 'true',
    alter: process.env.DB_ALTER_SYNC === 'true',
    match: /_dev$/ // Solo sincroniza en entornos que terminen en _dev
  };
 
  const finalOptions = { ...defaultOptions, ...options };
 
  try {
    console.log(' Sincronizando modelos...');
    await sequelize.sync(finalOptions);
   
    if (finalOptions.force) {
      console.warn('Todos los datos fueron borrados (force: true)');
    } else if (finalOptions.alter) {
      console.warn('Estructura modificada (alter: true)');
    }
   
    console.log('Modelos sincronizados correctamente');
  } catch (error) {
    console.error('Error sincronizando modelos:', error);
    throw error;
  }
};

export const initializeDatabase = async () => {
  try {
    await testConnection();
   
    if (process.env.NODE_ENV !== 'test') {
      await syncModels();
     
      if (process.env.NODE_ENV === 'development') {
        console.log(' Modelos registrados:',
          Object.keys(sequelize.models).join(', '));
       
        // Health check adicional
        const [queryTime] = await sequelize.query('SELECT NOW() as time');
        console.log('Hora de la base de datos:', queryTime[0].time);
      }
    }
  } catch (error) {
    console.error('fallo en inicialización:', error);
   
    // Cierra conexiones limpiamente
    try {
      await closeConnection();
    } catch (e) {
      console.error('Error durante cierre de emergencia:', e);
    }
   
    process.exit(1); // Termina el proceso con error
  }
};

// Cierre seguro con timeout
export const closeConnection = async () => {
  try {
    console.log(' Cerrando conexión...');
   
    await Promise.race([
      sequelize.close(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout al cerrar conexión')), 5000)
      )
    ]);
   
    console.log(' Conexión cerrada limpiamente');
  } catch (error) {
    console.error('Error cerrando conexión:', error);
    throw error;
  }
};

// Exportaciones mejor organizadas
export default {
  sequelize,
  Sequelize,
  models,
  testConnection,
  syncModels,
  initializeDatabase,
  closeConnection,
  getModel: (name) => {
    if (!sequelize.models[name]) {
      throw new Error(`Modelo "${name}" no registrado`);
    }
    return sequelize.models[name];
  }
};