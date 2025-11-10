//import App from "./app.js";
//import { PORT } from './config/puerto.js';
//import { connectDB } from './database/conexion.js';
//
//
//
//async function main(){
//    try {
//       await connectDB();
//        App.listen(PORT, () => {
//            console.log(`Servidor escuchando en http://localhost:${PORT}`);
//        })
//    } catch (error){
//        console.error("Error al conectarse a la base de datos", error);
//    }
//}
//
//main();

import App from "./app.js";
import { PORT } from './config/puerto.js';
import { connectDB } from './database/conexion.js';

const MAX_RETRIES = 10; // número máximo de intentos
const RETRY_DELAY = 5000; // 5 segundos entre intentos

async function connectWithRetry(attempt = 1) {
  try {
    console.log(`Intentando conectar a la base de datos (intento ${attempt}/${MAX_RETRIES})...`);
    await connectDB();

    // Render necesita que escuches en process.env.PORT
    App.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectarse a la base de datos:", error.message);

    if (attempt < MAX_RETRIES) {
      console.log(`Reintentando en ${RETRY_DELAY / 1000} segundos...`);
      setTimeout(() => connectWithRetry(attempt + 1), RETRY_DELAY);
    } else {
      console.error("🚨 No se pudo conectar a la base de datos después de varios intentos.");
      process.exit(1);
    }
  }
}

connectWithRetry();
