'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('courses', 'course_id', {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING(100),
        }, { transaction: t }),
        queryInterface.addColumn('courses', 'sub_url', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t })
      ]);
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('courses', 'course_id', { transaction: t }),
        queryInterface.removeColumn('courses', 'course_id', { transaction: t })
      ]);
    });
  }
};