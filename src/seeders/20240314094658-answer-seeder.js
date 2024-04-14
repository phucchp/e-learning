'use strict';
const { faker } = require('@faker-js/faker');

const answers = [];
const numberOfQuestions = 5000;
for (let i = 1; i <= numberOfQuestions; i++) {
  // For each question, randomly generate 4 answers, of which 1 is correct
  const correctAnswerIndex = faker.number.int({ min: 0, max: 3 });
  for (let j = 0; j < 4; j++) {
    const isCorrect = j === correctAnswerIndex;
    answers.push({
      question_id: i,
      content: faker.lorem.sentence(),
      is_correct: isCorrect,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Nên dùng for để tạo câu trả lời
    await queryInterface.bulkInsert('answers', answers, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('answers', null, {});
  }
};
