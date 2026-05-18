'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reportemantenimientoplantaselectricas', 'generador', {
      type: Sequelize.STRING(100),
      allowNull: true
    });

    await queryInterface.addColumn('reportemantenimientoplantaselectricas', 'motor', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('reportemantenimientoplantaselectricas', 'motor');
    await queryInterface.removeColumn('reportemantenimientoplantaselectricas', 'generador');
  }
};
