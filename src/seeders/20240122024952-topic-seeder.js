'use strict';
const { faker } = require('@faker-js/faker');
const generateRandomTopic = () => ({
  course_id: faker.number.int({ min: 1, max: 100 }), // Generate unique IDs
  name: faker.lorem.sentence(),
  created_at: faker.date.betweens({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' }),
  updated_at: faker.date.betweens({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' }),
});
const topics = [...Array(1000)].map(() => generateRandomTopic());

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('topics', topics, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('topics', null, {});
  }
};
