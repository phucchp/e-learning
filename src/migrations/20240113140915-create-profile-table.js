'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },
      },
      first_name:{
        type: Sequelize.STRING(30),
        allowNull: true,
        unique: true
      },
      last_name:{
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      avatar:{
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description:{
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable('profiles');
  }
};
