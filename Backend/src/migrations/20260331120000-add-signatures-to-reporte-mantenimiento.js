'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reportemantenimientoplantaselectricas', 'firma_tecnico', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('reportemantenimientoplantaselectricas', 'firma_recibido', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('reportemantenimientoplantaselectricas', 'firma_recibido');
    await queryInterface.removeColumn('reportemantenimientoplantaselectricas', 'firma_tecnico');
  }
};
