'use strict';
const { faker } = require('@faker-js/faker');

// const generateRandomCourse = () => ({
//   course_id: faker.string.uuid(), // Generate unique IDs
//   title: faker.lorem.sentence(),
//   introduction: faker.lorem.paragraph(),
//   description: faker.lorem.paragraphs(4),
//   price: faker.number.int({ min: 0, max: 200 }),
//   discount: faker.number.int({ min: 5, max: 50 }),
//   duration: faker.number.int({ min: 1, max: 40 }),
//   category_id: faker.number.int({ min: 1, max: 10 }), // Replace with an existing category ID
//   instructor_id: faker.number.int({ min: 1, max: 5 }), // Replace with an existing instructor ID
//   average_rating: faker.number.float({ min: 2, max: 5 }),
//   learns_description: faker.lorem.sentences(5),
//   requirements_description: faker.lorem.sentences(4),
//   trailer_url: 'courses/defaults/trailer.mp4',
//   poster_url: 'courses/defaults/poster.jpg',
//   sub_url: faker.internet.url(),
//   total_students: faker.number.int({ min: 50, max: 5000 }),
//   total_lessons: faker.number.int({ min: 5, max: 50 }),
//   language_id: faker.number.int({ min: 1, max: 20 }), // Replace with an existing language ID
//   level_id: faker.number.int({ min: 1, max: 4 }),
//   is_active: faker.datatype.boolean(),
//   created_at: new Date(),
//   updated_at: new Date(),
// });
// const courses = [...Array(100)].map(() => generateRandomCourse());
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.bulkInsert('courses', courses, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('courses', null, {});
  }
};
