'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('profiles', [
      {
        user_id: 1, // replace with an existing user ID
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'users/1/avatar.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2, // replace with an existing user ID
        first_name: 'Hữu',
        last_name: 'Phúc',
        avatar: 'users/2/avatar.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 3, // replace with an existing user ID
        first_name: 'Bảo',
        last_name: 'Long',
        avatar: 'users/3/avatar.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 4, // replace with an existing user ID
        first_name: 'Quang',
        last_name: 'Vinh',
        avatar: 'users/4/avatar.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 5, // replace with an existing user ID
        first_name: 'Yến',
        last_name: 'Nhi',
        avatar: 'users/5/avatar.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Add more profiles as needed
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('profiles', null, {});
  }
};
