import 'dotenv/config';
import pkg from 'pg';

const { Pool } = pkg ;


// configuramos la conexion con la base de datos postgresql
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// conexion con la base de datos 
export const conectDB = async () => {
    try {
        const demoProyect = await pool.connect();
        console.log('Conectado a la base de datos');
        demoProyect.release();
    } catch (error) {
        console.log('Error a conectarse a la base de datos', error);
        process.exit(1);
    }
    
};

const Usuario = require('../models/usuario')(sequelize);

// cnoxion con el modelo
module.exports = {
  sequelize,
  models: {
    Usuario: Usuario
  }
};