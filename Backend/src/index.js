import App from "./app.js";
import { PORT } from './config/puerto.js';
import { conectDB } from "./database/conexion.js";


async function main(){
    try {
        await conectDB();
        App.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        })
    } catch (error){
        console.error("Error al conectarse a la base de datos", error);
    }
}

main();