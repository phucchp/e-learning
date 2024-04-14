'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const defaultAvt = 'default/avatar.jpg';
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
      {
        user_id: 6, // replace with an existing user ID
        first_name: 'Admin',
        last_name: 'Admin',
        avatar: 'users/6/avatar.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 7, // replace with an existing user ID
        first_name: 'Instructor',
        last_name: 'Instructor',
        avatar: 'users/6/avatar.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 8,
        first_name: 'Firstname8',
        last_name: 'LastName8',
        avatar: defaultAvt,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 9,
        first_name: 'Firstname9',
        last_name: 'LastName9',
        avatar: defaultAvt,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 10,
        first_name: 'Firstname10',
        last_name: 'LastName10',
        avatar: defaultAvt,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 11,
        first_name: 'Firstname11',
        last_name: 'LastName11',
        avatar: defaultAvt,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 12,
        first_name: 'Firstname12',
        last_name: 'LastName12',
        avatar: defaultAvt,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 13,
        first_name: 'Firstname13',
        last_name: 'LastName13',
        avatar: defaultAvt,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 14,
        first_name: 'Firstname14',
        last_name: 'LastName14',
        avatar: defaultAvt,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 15,
        first_name: 'Firstname15',
        last_name: 'LastName15',
        avatar: defaultAvt,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 16,
        first_name: 'Firstname16',
        last_name: 'LastName16',
        avatar: defaultAvt,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 17,
        first_name: 'Firstname17',
        last_name: 'LastName17',
        avatar: defaultAvt,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 18,
        first_name: 'Firstname18',
        last_name: 'LastName18',
        avatar: defaultAvt,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 19,
        first_name: 'Firstname19',
        last_name: 'LastName19',
        avatar: defaultAvt,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 20,
        first_name: 'Firstname20',
        last_name: 'LastName20',
        avatar: defaultAvt,
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
