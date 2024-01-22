'use strict';

const { faker } = require('@faker-js/faker');

const generateRandomReview = (userId, courseId) => {
  return {
    user_id: userId,
    course_id: courseId,
    rating:  faker.number.float({ min: 1, max: 5 }),
    review: faker.lorem.lines(2),
    created_at: faker.date.betweens({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' }),
    updated_at: faker.date.betweens({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' }),
  };
};

const generateReviewSeeds = () => {
  const seeds = [];
  const numberOfUsers = 5;
  const numberOfCourses = 100;

  for (let userId = 1; userId <= numberOfUsers; userId++) {
    for (let courseId = 1; courseId <= numberOfCourses; courseId++) {
      seeds.push(generateRandomReview(userId, courseId));
    }
  }

  return seeds;
};

const reviews = generateReviewSeeds();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('reviews', reviews, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reviews', null, {});
  }
};
