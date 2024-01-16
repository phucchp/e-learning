'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = 'hgdhasdgasghdghasdasghh'; // Replace 'password123' with the desired password

    await queryInterface.bulkInsert('users', [
      {
        username: 'user1',
        email: 'user1@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 1, // Replace with an existing role ID
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'user2',
        email: 'user2@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 1, // Replace with an existing role ID
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'user3',
        email: 'user3@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 2, // Replace with an existing role ID
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'user4',
        email: 'user4@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 2, // Replace with an existing role ID
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'user5',
        email: 'user5@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 3, // Replace with an existing role ID
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
