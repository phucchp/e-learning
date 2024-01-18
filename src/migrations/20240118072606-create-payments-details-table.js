'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('payment_details', {
      payment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },
      },
      course_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true,
        references: {
          model: {
            tableName: 'courses',
          },
          key: 'course_id'
        },
      },
      price:{
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      discount:{
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('payment_details');
  }
};
