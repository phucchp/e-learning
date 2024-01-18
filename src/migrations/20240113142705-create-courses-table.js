'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      introduction: {
        type: Sequelize.TEXT,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      discount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'categories',
          },
          key: 'id'
        },
      },
      instructor_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },

      },
      average_rating: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      trailer_url: {
        type: Sequelize.STRING,
      },
      poster_url: {
        type: Sequelize.STRING,
      },
      total_students: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      total_lessons: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      language_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'languages',
          },
          key: 'id'
        },
      },
      level_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'levels',
          },
          key: 'id'
        },
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.dropTable('courses');
  }
};
