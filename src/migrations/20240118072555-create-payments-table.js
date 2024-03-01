'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },
      },
      price:{
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      payment_method:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      transaction_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      status:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      order_info:{
        type: Sequelize.STRING,
      },
      is_payment:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
     await queryInterface.dropTable('payments');
  }
};
