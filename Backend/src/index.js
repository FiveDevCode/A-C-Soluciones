import app from './app.js'; 
import { PORT } from './config/puerto.js';
import { sequelize } from './database/conexion.js';
import portfinder from 'portfinder';

async function main() {
    try {
        // 1. Autenticar conexión a la base de datos
        await sequelize.authenticate();
        console.log('Conexión a PostgreSQL establecida');

        // 2. Sincronizar modelos (opcional: configurar según entorno)
        const syncOptions = process.env.NODE_ENV === 'test' 
            ? { force: false } 
            : { alter: true };
        
        await sequelize.sync(syncOptions);
        console.log('Modelos sincronizados');

        // 3. Encontrar puerto disponible
        portfinder.basePort = PORT;
        const availablePort = await portfinder.getPortPromise();

        // 4. Iniciar servidor con manejo de errores
        const server = app.listen(availablePort, () => {
            console.log(`Servidor escuchando en http://localhost:${availablePort}`);
            console.log(`Documentación API disponible en http://localhost:${availablePort}/api-docs`);
        });

        // Manejo de cierre elegante
        const shutdown = async () => {
            console.log('\nRecibida señal de apagado, cerrando servidor...');
            server.close(async () => {
                console.log('Servidor HTTP cerrado');
                await sequelize.close();
                console.log('Conexiones de base de datos cerradas');
                process.exit(0);
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

        // Manejo específico de error EADDRINUSE
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Puerto ${availablePort} en uso, intentando con otro...`);
                main(); // Reinicia con nuevo puerto
            } else {
                console.error('Error del servidor:', err);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('Error al iniciar la aplicación:', error.message);
        
        // Cierre seguro de conexiones
        try {
            await sequelize.close();
            console.log('Conexiones de base de datos cerradas');
        } catch (dbError) {
            console.error('Error al cerrar conexiones:', dbError);
        }
        
        process.exit(1);
    }
}

// Manejo de promesas no capturadas
process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection:', err.message);
});

// Iniciar aplicación
main();