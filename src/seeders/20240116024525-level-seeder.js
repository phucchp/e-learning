'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('levels', [
      { level_name: 'Beginner', created_at: new Date(), updated_at: new Date() },
      { level_name: 'Intermediate', created_at: new Date(), updated_at: new Date() },
      { level_name: 'Advanced', created_at: new Date(), updated_at: new Date() },
      { level_name: 'All', created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('levels', null, {});
  }
};
