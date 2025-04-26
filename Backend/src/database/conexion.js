import Sequelize from 'sequelize'
import 'dotenv/config';


// configuramos la conexion con la base de datos postgresql
export const sequelize = new Sequelize( process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false
});


// conexion con la base de datos 
export const conectDB = async () => {
    try {
        await sequelize.authenticate ();
        console.log('Conectado a la base de datos PostgreSQL con Sequelize');
        await sequelize.sync({alter: true})
        console.log("Tablas sincronizadas");
    } catch (error) {
        console.log('Error a conectarse a la base de datos', error);
        process.exit(1);
    }
    
};


