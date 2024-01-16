'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('courses', [
      {
        course_id: 'introduction-to-programing',
        title: 'Introduction to Programming',
        introduction: 'Learn the basics of programming with this introductory course.',
        description: 'This course covers fundamental programming concepts and helps beginners get started.',
        price: 49.99,
        discount: 10.00,
        category_id: 27, // Replace with an existing category ID
        instructor_id: 1, // Replace with an existing instructor ID
        average_rating: 4.5,
        trailer_url: 'https://www.youtube.com/watch?v=ABC123',
        poster_url: 'https://example.com/poster1.jpg',
        sub_url:'https://www.youtube.com/watch?v=ABC123',
        total_students: 1000,
        total_lessons: 20,
        language_id: 21, // Replace with an existing language ID
        level_id: 1, // Replace with an existing level ID
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        course_id: 'web-development-bootcamp',
        title: 'Web Development Bootcamp',
        introduction: 'Become a full-stack web developer with this comprehensive bootcamp.',
        description: 'Master web development skills with hands-on projects and real-world applications.',
        price: 99.99,
        discount: 20.00,
        category_id: 26, // Replace with an existing category ID
        instructor_id: 2, // Replace with an existing instructor ID
        average_rating: 4.8,
        trailer_url: 'https://www.youtube.com/watch?v=XYZ456',
        poster_url: 'https://example.com/poster2.jpg',
        sub_url:'https://www.youtube.com/watch?v=ABC123',
        total_students: 1500,
        total_lessons: 30,
        language_id: 21, // Replace with an existing language ID
        level_id: 2, // Replace with an existing level ID
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('courses', null, {});
  }
};