'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = '$2b$10$D69VoJEoIijwminkjAo.recens0qA/NXN1.PiVy.S8j6ou29G4WlW'; // Replace 'password123' with the desired password

    await queryInterface.bulkInsert('users', [
      {
        user_name: 'user1',
        email: 'user1@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 1, // Replace with an existing role ID
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'user2',
        email: 'user2@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 1, // Replace with an existing role ID
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'user3',
        email: 'user3@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 2, // Replace with an existing role ID
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'user4',
        email: 'user4@gmail.com',
        password: hashedPassword,
        is_active: true,
        role_id: 2, // Replace with an existing role ID
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_name: 'user5',
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
