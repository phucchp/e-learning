'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = '$2b$10$VuzRJNXJS6u87eZK6S7JQO9y0qoyOHfp6IKo.eCwcnBXtLuTJltOy'; // Replace 'password123' with the desired password

    await queryInterface.bulkInsert('users', [
      {
        user_name: 'user1',
        email: 'user1@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 1,  
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'user2',
        email: 'user2@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 1,  
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'user3',
        email: 'user3@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 2,  
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'user4',
        email: 'user4@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 2,  
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'user5',
        email: 'user5@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 3,  
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'user6',
        email: 'admin@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 3,  
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'user6',
        email: 'instructor@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 2,  
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
