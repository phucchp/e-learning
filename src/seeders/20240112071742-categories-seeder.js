'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('categories', [
      {
        category_id: 'programming',
        name: 'Programming',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: 'web-development',
        name: 'Web Development',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: 'networking',
        name: 'Networking',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: 'database',
        name: 'Database Management',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: 'cybersecurity',
        name: 'Cybersecurity',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: 'cloud-computing',
        name: 'Cloud Computing',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: 'data-science',
        name: 'Data Science',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: 'mobile-development',
        name: 'Mobile App Development',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: 'machine-learning',
        name: 'Machine Learning',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: 'devops',
        name: 'DevOps',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};