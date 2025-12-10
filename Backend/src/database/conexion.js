import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  
  // Pool optimizado para múltiples usuarios concurrentes
  pool: {
    max: 20,              // Aumentado para soportar más usuarios simultáneos
    min: 5,               // Mantener 5 conexiones siempre activas
    acquire: 30000,       // 30s para adquirir conexión
    idle: 300000,         // 5 minutos antes de liberar (para usuarios inactivos)
    evict: 60000,         // Limpiar conexiones cada minuto
    maxUses: 7500,        // Renovar conexión después de 7500 usos
  },
  
  dialectOptions: {
    keepAlive: true,
    keepAliveInitialDelayMillis: 30000,  // Keep-alive cada 30s
    statement_timeout: 30000,
    connectionTimeoutMillis: 10000,
    idle_in_transaction_session_timeout: 30000, // Evita transacciones colgadas
  },
  
  // Retry para errores de conexión
  retry: {
    max: 3,
    timeout: 3000,
    match: [
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /ECONNRESET/,
      /EPIPE/,
      /PROTOCOL_CONNECTION_LOST/,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /Connection terminated unexpectedly/,
    ],
  },
  
  // Configuración adicional para estabilidad
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
  },
  
  // Hooks para manejo de errores
  hooks: {
    beforeConnect: async (config) => {
      // Log de intento de conexión (útil para debug)
      if (process.env.DEBUG_DB) {
        console.log('🔌 Intentando conectar a la BD...');
      }
    },
  },
});

// Variables de control
let isReconnecting = false;
let reconnectAttempts = 0;
let lastHealthCheck = Date.now();
let healthCheckInterval = null;

// Función de conexión inicial
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado correctamente a la base de datos');
    console.log(`📊 Pool configurado: min=${sequelize.config.pool.min}, max=${sequelize.config.pool.max}`);
    
    // Iniciar health check inteligente
    startSmartHealthCheck();
    
    reconnectAttempts = 0;
    return true;
  } catch (error) {
    console.error('❌ Error al conectarse a la base de datos:', error.message);
    
    // Intentar reconectar solo en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Intentando reconexión...');
      return await handleReconnect();
    }
    
    process.exit(1);
  }
};

// Reconexión inteligente con backoff exponencial
const handleReconnect = async () => {
  if (isReconnecting) {
    console.log('⏳ Reconexión ya en progreso...');
    return false;
  }

  isReconnecting = true;
  const maxAttempts = 5;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔄 Intento de reconexión ${attempt}/${maxAttempts}...`);
      
      // Cerrar conexiones muertas antes de reintentar
      if (attempt > 1) {
        try {
          await sequelize.connectionManager.pool.drain();
          await sequelize.connectionManager.pool.clear();
        } catch (err) {
          console.log('⚠️  No se pudo limpiar el pool:', err.message);
        }
      }
      
      await sequelize.authenticate();
      console.log('✅ Reconexión exitosa');
      
      isReconnecting = false;
      reconnectAttempts = 0;
      return true;
      
    } catch (error) {
      console.error(`❌ Intento ${attempt} fallido:`, error.message);
      
      if (attempt < maxAttempts) {
        // Backoff exponencial: 2s, 4s, 8s, 16s
        const waitTime = Math.min(2000 * Math.pow(2, attempt - 1), 30000);
        console.log(`⏱️  Esperando ${waitTime / 1000}s antes de reintentar...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  console.error('⚠️ No se pudo reconectar. La aplicación continuará pero con BD limitada.');
  isReconnecting = false;
  reconnectAttempts++;
  
  // Si falla muchas veces, esperar más antes del próximo intento
  if (reconnectAttempts > 3) {
    console.log('⏸️  Esperando 2 minutos antes de próximo intento automático...');
    setTimeout(() => {
      reconnectAttempts = 0;
    }, 120000);
  }
  
  return false;
};

// Health check inteligente que se adapta al uso
const startSmartHealthCheck = () => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
  // Health check cada 2 minutos (menos agresivo)
  healthCheckInterval = setInterval(async () => {
    const timeSinceLastCheck = Date.now() - lastHealthCheck;
    
    // Solo hacer check si no hay reconexión en curso
    if (!isReconnecting && timeSinceLastCheck >= 120000) {
      try {
        // Verificar sin authenticate (más ligero)
        const poolSize = sequelize.connectionManager.pool.size;
        const available = sequelize.connectionManager.pool.available;
        
        if (process.env.DEBUG_DB) {
          console.log(`📊 Pool status: ${available}/${poolSize} disponibles`);
        }
        
        // Solo hacer authenticate si el pool está vacío o con problemas
        if (poolSize === 0 || available === 0) {
          await sequelize.authenticate();
        }
        
        lastHealthCheck = Date.now();
      } catch (error) {
        console.error('⚠️  Health check falló:', error.message);
        
        if (!isReconnecting) {
          handleReconnect().catch(err => {
            console.error('Error en reconexión automática:', err.message);
          });
        }
      }
    }
  }, 120000); // Cada 2 minutos
};

// Wrapper para capturar errores de queries y conexión
const originalQuery = sequelize.connectionManager.getConnection;
sequelize.connectionManager.getConnection = async function(...args) {
  try {
    return await originalQuery.apply(this, args);
  } catch (error) {
    console.error('🔴 Error al obtener conexión:', error.message);
    
    const criticalErrors = ['ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'EPIPE'];
    if (criticalErrors.includes(error.code) && !isReconnecting) {
      console.log('🔄 Error crítico detectado, iniciando reconexión...');
      handleReconnect().catch(err => {
        console.error('Error en reconexión:', err.message);
      });
    }
    
    throw error;
  }
};

// Manejo de cierre graceful
const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️  Señal ${signal} recibida. Cerrando conexiones...`);
  
  // Detener health check
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
  
  try {
    // Esperar a que terminen las queries en curso (máximo 10s)
    console.log('⏳ Esperando queries en curso...');
    await Promise.race([
      sequelize.close(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 10000)
      )
    ]);
    
    console.log('✅ Conexiones cerradas correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cerrar conexiones:', error.message);
    console.log('⚠️  Forzando cierre...');
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Capturar errores no manejados para evitar crashes
process.on('unhandledRejection', (reason, promise) => {
  if (reason && reason.name === 'SequelizeConnectionError') {
    console.error('🔴 Error de conexión no manejado:', reason.message);
    if (!isReconnecting) {
      handleReconnect().catch(err => {
        console.error('Error en reconexión por unhandledRejection:', err.message);
      });
    }
  }
});

// Función para verificar salud de la conexión (más ligera)
export const checkDBHealth = async () => {
  try {
    const poolStatus = {
      size: sequelize.connectionManager.pool.size,
      available: sequelize.connectionManager.pool.available,
      using: sequelize.connectionManager.pool.using,
      waiting: sequelize.connectionManager.pool.waiting,
    };
    
    // Solo hacer authenticate si parece haber problemas
    if (poolStatus.size === 0) {
      await sequelize.authenticate();
    }
    
    return { 
      status: 'healthy', 
      pool: poolStatus,
      timestamp: new Date() 
    };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error.message, 
      timestamp: new Date() 
    };
  }
};

// Middleware para queries críticas (usar solo cuando sea necesario)
export const ensureConnection = async () => {
  try {
    // Verificación rápida del pool
    if (sequelize.connectionManager.pool.available > 0) {
      return true;
    }
    
    // Si no hay conexiones disponibles, verificar
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error('⚠️  Conexión no disponible:', error.message);
    
    // Intentar reconectar solo si no está en progreso
    if (!isReconnecting) {
      await handleReconnect();
    }
    
    return false;
  }
};

// Función helper para obtener estadísticas del pool
export const getPoolStats = () => {
  return {
    size: sequelize.connectionManager.pool.size,
    available: sequelize.connectionManager.pool.available,
    using: sequelize.connectionManager.pool.using,
    waiting: sequelize.connectionManager.pool.waiting,
    max: sequelize.config.pool.max,
    min: sequelize.config.pool.min,
  };
};

// Exportar función para debug (útil en desarrollo)
if (process.env.DEBUG_DB) {
  setInterval(() => {
    const stats = getPoolStats();
    console.log('📊 Pool Stats:', JSON.stringify(stats, null, 2));
  }, 30000); // Cada 30s en modo debug
}