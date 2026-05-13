'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'reportemantenimientoplantaselectricas';
    const table = await queryInterface.describeTable(tableName);

    if (!table.firma_tecnico) {
      await queryInterface.addColumn(tableName, 'firma_tecnico', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (!table.firma_recibido) {
      await queryInterface.addColumn(tableName, 'firma_recibido', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
  },

  async down(queryInterface) {
    const tableName = 'reportemantenimientoplantaselectricas';
    const table = await queryInterface.describeTable(tableName);

    if (table.firma_recibido) {
      await queryInterface.removeColumn(tableName, 'firma_recibido');
    }

    if (table.firma_tecnico) {
      await queryInterface.removeColumn(tableName, 'firma_tecnico');
    }
  }
};
