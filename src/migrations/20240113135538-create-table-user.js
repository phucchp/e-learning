'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_name:{
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      email:{
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      password:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_active:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      role_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('users');
  }
};
