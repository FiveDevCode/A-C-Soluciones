const App = require('./app.js');
const { PORT } = require('./config/puerto.js');
const { connectDB } = require('./database/conexion.js');

async function main() {
  try {
    await connectDB();
    App.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectarse a la base de datos', error);
  }
}

main();
