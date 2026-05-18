import { sequelize } from './src/database/conexion.js';

async function check() {
  try {
    const [results1] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reportebombeo';
    `);
    console.log('reportebombeo columns:', results1);

    const [results2] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'equipobombeo';
    `);
    console.log('equipobombeo columns:', results2);

    const [results3] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'parametrobombeo';
    `);
    console.log('parametrobombeo columns:', results3);
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}
check();