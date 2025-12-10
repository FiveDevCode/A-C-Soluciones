import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  
  // Configuración mejorada del pool
  pool: {
    max: 10,
    min: 2,
    acquire: 60000,
    idle: 30000,
    evict: 10000,        // Verifica conexiones inactivas cada 10s
    maxUses: 1000,       // Recicla conexiones después de 1000 usos
  },
  
  dialectOptions: {
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    statement_timeout: 60000,
    
    // Configuración adicional para manejar desconexiones
    connectionTimeoutMillis: 10000,
  },
  
  // Retry automático en caso de fallo
  retry: {
    max: 3,
    timeout: 3000,
    match: [
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /ENOTFOUND/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /Connection terminated/,
      /Connection lost/,
    ],
  },
});

// Variable para controlar estado de reconexión
let isReconnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Función mejorada de conexión
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado correctamente a la base de datos');
    reconnectAttempts = 0;
    isReconnecting = false;
  } catch (error) {
    console.error('❌ Error al conectarse a la base de datos:', error.message);
    process.exit(1);
  }
};

// Función de reconexión automática
const handleReconnect = async () => {
  if (isReconnecting) {
    console.log('⏳ Ya hay un intento de reconexión en curso...');
    return;
  }

  isReconnecting = true;
  reconnectAttempts++;

  console.log(`🔄 Intentando reconectar... (Intento ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);

  try {
    // Cerrar conexiones existentes
    await sequelize.connectionManager.close();
    
    // Esperar antes de reconectar
    await new Promise(resolve => setTimeout(resolve, 3000 * reconnectAttempts));
    
    // Intentar reconectar
    await sequelize.authenticate();
    
    console.log('✅ Reconexión exitosa');
    reconnectAttempts = 0;
    isReconnecting = false;
  } catch (error) {
    console.error(`❌ Reconexión fallida (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}):`, error.message);
    
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('💀 Máximo de intentos alcanzado. Cerrando aplicación...');
      isReconnecting = false;
      process.exit(1);
    }
    
    isReconnecting = false;
    // Reintentar automáticamente
    setTimeout(handleReconnect, 5000);
  }
};

// Hook para capturar errores de conexión
sequelize.beforeConnect(async (config) => {
  // Este hook se ejecuta antes de cada conexión
});

sequelize.afterConnect(async (connection, config) => {
  // Listener de errores en la conexión individual
  connection.on('error', (error) => {
    console.error('🔴 Error en conexión:', error.message);
    
    if (error.code === 'ECONNREFUSED' || 
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND' ||
        error.message.includes('Connection terminated') ||
        error.message.includes('Connection lost')) {
      handleReconnect();
    }
  });
});

// Manejo de cierre graceful
const gracefulShutdown = async () => {
  console.log('\n⚠️  Cerrando conexiones a la base de datos...');
  try {
    await sequelize.close();
    console.log('✅ Conexiones cerradas correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cerrar conexiones:', error);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Función auxiliar para verificar salud de la conexión
export const checkDBHealth = async () => {
  try {
    await sequelize.authenticate();
    return { status: 'healthy', timestamp: new Date() };
  } catch (error) {
    console.error('⚠️  Base de datos no disponible:', error.message);
    handleReconnect();
    return { status: 'unhealthy', error: error.message, timestamp: new Date() };
  }
};

// Health check periódico opcional (ejecutar cada 30s)
setInterval(() => {
  if (!isReconnecting) {
    checkDBHealth();
  }
}, 30000);