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
    evict: 10000,
    maxUses: 1000,
  },
  
  dialectOptions: {
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    statement_timeout: 60000,
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
let healthCheckInterval = null;

// Función mejorada de conexión
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado correctamente a la base de datos');
    reconnectAttempts = 0;
    isReconnecting = false;
    
    // Iniciar health check periódico
    startHealthCheck();
    
    return true;
  } catch (error) {
    console.error('❌ Error al conectarse a la base de datos:', error.message);
    
    // En lugar de cerrar la aplicación, intentar reconectar
    console.log('🔄 Intentando reconexión automática...');
    await handleReconnect();
    return false;
  }
};

// Función de reconexión automática mejorada
const handleReconnect = async () => {
  if (isReconnecting) {
    console.log('⏳ Ya hay un intento de reconexión en curso...');
    return;
  }

  isReconnecting = true;
  reconnectAttempts++;

  console.log(`🔄 Intentando reconectar... (Intento ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);

  try {
    // NO cerrar el connectionManager, solo verificar la conexión
    await sequelize.authenticate();
    
    console.log('✅ Reconexión exitosa');
    reconnectAttempts = 0;
    isReconnecting = false;
    return true;
  } catch (error) {
    console.error(`❌ Reconexión fallida (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}):`, error.message);
    
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('⚠️ Máximo de intentos alcanzado. La aplicación continuará funcionando pero sin conexión a BD.');
      console.error('💡 Verifica tu base de datos y la aplicación intentará reconectar automáticamente.');
      reconnectAttempts = 0; // Resetear para permitir futuros intentos
      isReconnecting = false;
      return false;
    }
    
    isReconnecting = false;
    
    // Esperar antes de reintentar (backoff exponencial)
    const waitTime = Math.min(5000 * reconnectAttempts, 30000);
    console.log(`⏱️  Reintentando en ${waitTime / 1000} segundos...`);
    
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return await handleReconnect();
  }
};

// Hook para capturar errores de conexión
sequelize.afterConnect(async (connection, config) => {
  connection.on('error', (error) => {
    console.error('🔴 Error en conexión:', error.message);
    
    // Solo reconectar en errores de red, no en errores de queries
    if (error.code === 'ECONNREFUSED' || 
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND' ||
        error.message.includes('Connection terminated') ||
        error.message.includes('Connection lost')) {
      
      // No esperar la reconexión, dejar que ocurra en background
      handleReconnect().catch(err => {
        console.error('Error en handleReconnect:', err.message);
      });
    }
  });
});

// Manejo de cierre graceful
const gracefulShutdown = async () => {
  console.log('\n⚠️  Cerrando conexiones a la base de datos...');
  
  // Detener health check
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
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
    
    // Solo intentar reconectar si no hay uno en curso
    if (!isReconnecting) {
      handleReconnect().catch(err => {
        console.error('Error en health check reconnect:', err.message);
      });
    }
    
    return { status: 'unhealthy', error: error.message, timestamp: new Date() };
  }
};

// Función para iniciar health check periódico
const startHealthCheck = () => {
  // Limpiar intervalo anterior si existe
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
  // Health check cada 60 segundos (aumentado para reducir carga)
  healthCheckInterval = setInterval(() => {
    if (!isReconnecting) {
      checkDBHealth().catch(err => {
        console.error('Error en health check:', err.message);
      });
    }
  }, 60000);
};

// Middleware para verificar conexión antes de queries críticas
export const ensureConnection = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error('⚠️  Conexión no disponible:', error.message);
    
    if (!isReconnecting) {
      await handleReconnect();
    }
    
    return false;
  }
};