'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = [];
    for(let i = 21; i<=142; i++) {
      data.push({
        user_id:i,
        type: 'Paypal',
        email: `elearning-user-${i}@gmail.com`
      });
    }
    await queryInterface.bulkInsert('e_wallets',data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('e_wallets', null, {});
  }
};
// [
//   {
//       user_id:1,
//       type: 'Paypal',
//       email: 'elearning-user-1@gmail.com',
//   },
//   {
//       user_id:2,
//       type: 'Paypal',
//       email: 'elearning-user-2@gmail.com',
//   },
//   {
//       user_id:3,
//       type: 'Paypal',
//       email: 'elearning-user-3@gmail.com',
//   },
//   {
//       user_id:4,
//       type: 'Paypal',
//       email: 'elearning-user-4@gmail.com',
//   },
//   {
//       user_id:5,
//       type: 'Paypal',
//       email: 'elearning-user-5@gmail.com',
//   },
// ]