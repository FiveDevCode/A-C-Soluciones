import { createServer } from 'http';
import { Server } from 'socket.io';
import App, { setupSocket } from "./app.js";
import { PORT } from './config/puerto.js';
import { connectDB } from './database/conexion.js';

async function main(){
    try {
        await connectDB();
        
        // Crear servidor HTTP
        const httpServer = createServer(App);
        
        // Configurar Socket.io
        const io = new Server(httpServer, {
            cors: {
                origin: [
                    'https://a-c-soluciones.vercel.app',
                    'capacitor://localhost',
                    'http://localhost:3000',
                    'http://127.0.0.1:3000',
                    'http://localhost:5173'
                ],
                credentials: true
            }
        });
        
        // Manejar conexiones de Socket.io
        io.on('connection', (socket) => {
            console.log(`✅ Usuario conectado: ${socket.id}`);
            
            // El cliente debe emitir este evento con su id y tipo al conectarse
            socket.on('autenticar_notificaciones', (data) => {
                const { id_usuario, tipo_usuario } = data;
                const room = `usuario_${tipo_usuario}_${id_usuario}`;
                socket.join(room);
                console.log(`📢 Usuario ${tipo_usuario} ${id_usuario} unido a room: ${room}`);
            });
            
            socket.on('disconnect', () => {
                console.log(`❌ Usuario desconectado: ${socket.id}`);
            });
        });
        
        // Inicializar Socket.io en el servicio de notificaciones
        setupSocket(io);
        
        // Iniciar servidor
        httpServer.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
            console.log(`⚡ WebSocket habilitado para notificaciones en tiempo real`);
        });
    } catch (error){
        console.error("Error al conectarse a la base de datos", error);
    }
}

main();