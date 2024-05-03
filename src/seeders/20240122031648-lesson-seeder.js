// 'use strict';
// const { faker } = require('@faker-js/faker');

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     const lessonsData = [];

//     // Generate random lessons for each topic
//     for (let topicId = 1; topicId <= 1000; topicId++) {
//       const numberOfLessons = faker.number.int({ min: 3, max: 10 });

//       for (let i = 1; i <= numberOfLessons; i++) {
//         const lesson = {
//           title: faker.lorem.words(3),
//           duration: faker.number.int({ min: 1, max: 60 }), // Random duration between 30 and 180 minutes
//           is_preview: faker.datatype.boolean(),
//           topic_id: topicId,
//           lesson_url: 'courses/defaults/trailer.mp4',
//           created_at: new Date(),
//           updated_at: new Date(),
//         };

//         lessonsData.push(lesson);
//       }
//     }

//     await queryInterface.bulkInsert('lessons', lessonsData, {});
//   },

//   async down (queryInterface, Sequelize) {
//     await queryInterface.bulkDelete('lessons', null, {});
//   }
// };
