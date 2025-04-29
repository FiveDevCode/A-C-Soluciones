import app from './app.js'; // Cambiado a minúscula para consistencia
import { PORT } from './config/puerto.js';
import { sequelize } from './database/conexion.js'; // Cambiado a import directo de sequelize

async function main() {
    try {
        // 1. Autenticar conexión a la base de datos
        await sequelize.authenticate();
        console.log('Conexión a PostgreSQL establecida');

        // 2. Sincronizar modelos (opcional: configurar según entorno)
        const syncOptions = process.env.NODE_ENV === 'test' 
            ? { force: false } 
            : { alter: true }; // Cambia esto según tus necesidades
        
        await sequelize.sync(syncOptions);
        console.log('🔄 Modelos sincronizados');

        // 3. Iniciar servidor
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
            console.log(`Documentación API disponible en http://localhost:${PORT}/api-docs`);
        });

    } catch (error) {
        console.error(' Error al iniciar la aplicación:', error.message);
        
        // Cierre seguro de conexiones
        try {
            await sequelize.close();
            console.log('Conexiones de base de datos cerradas');
        } catch (dbError) {
            console.error('Error al cerrar conexiones:', dbError);
        }
        
        process.exit(1); // Terminar proceso con error
    }
}

// Manejo de promesas no capturadas
process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection:', err.message);
});

// Iniciar aplicación
main();