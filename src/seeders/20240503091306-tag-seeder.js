'use strict';

const tags = [
  'android',
  'applicants',
  'aws',
  'business',
  'coding',
  'data-science',
  'design',
  'development',
  'html',
  'css',
  'node',
  'programming',
  'mysql',
  'seo',

];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('tags', tags, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tags', null, {});
  }
};
