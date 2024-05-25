'use strict';
const { faker } = require('@faker-js/faker');

const generateRandomQuestion = () => ({
  user_id: faker.number.int({ min: 1, max: 20 }), // Generate unique IDs
  topic_id: faker.number.int({ min: 1, max: 1000 }), // Generate unique IDs
  content: faker.lorem.sentence(),
  created_at: new Date(),
  updated_at: new Date(),
});
const questions = [...Array(5000)].map(() => generateRandomQuestion());


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('questions', questions, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('questions', null, {});
  }
};
