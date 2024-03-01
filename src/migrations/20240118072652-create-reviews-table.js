'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('reviews', {
      user_id: {
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
      rating:{
        type: Sequelize.DECIMAL(2,1),
        allowNull: false,
      },
      review:{
        type: Sequelize.STRING,
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
     await queryInterface.dropTable('reviews');
  }
};
